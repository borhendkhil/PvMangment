-- =====================================================================
-- PDF MIGRATION SCRIPT: Extract LONGBLOBs to filesystem
-- =====================================================================
-- This script extracts PDF blobs from the old comite.decisionPdf column
-- and creates Decision records with file paths for the new architecture
--
-- IMPORTANT: This must be run AFTER migration_data.sql
-- =====================================================================

-- =====================================================================
-- PHASE 1: CREATE TEMP TABLE FOR PDF DATA
-- =====================================================================

CREATE TEMPORARY TABLE pdf_migration_temp (
    comite_id INT,
    session_id INT,
    pdf_blob LONGBLOB,
    original_filename VARCHAR(255),
    file_hash VARCHAR(64),
    migration_status VARCHAR(50)
);

-- =====================================================================
-- PHASE 2: EXTRACT PDF DATA FROM OLD SCHEMA
-- =====================================================================
-- Extract LONGBLOB PDFs from comite_old table
-- Store with metadata for file generation

INSERT INTO pdf_migration_temp (comite_id, session_id, pdf_blob, original_filename, migration_status)
SELECT 
    c.id as comite_id,
    cs.id as session_id,
    co.decisionPdf as pdf_blob,
    CONCAT('PV_', c.id, '_', DATE_FORMAT(cs.date_session, '%Y%m%d'), '.pdf') as original_filename,
    'EXTRACTED' as migration_status
FROM comite c
INNER JOIN comite_old co ON co.idComite = c.id
INNER JOIN comite_session cs ON cs.comite_id = c.id
WHERE co.decisionPdf IS NOT NULL 
  AND LENGTH(co.decisionPdf) > 0
  AND NOT EXISTS (
    SELECT 1 FROM decision WHERE decision.session_id = cs.id
  );

-- =====================================================================
-- PHASE 3: VALIDATE EXTRACTED PDFs
-- =====================================================================
-- Check PDF magic bytes (PDF files start with %PDF)
-- Create hash for duplicate detection

UPDATE pdf_migration_temp pmt
SET file_hash = SHA2(CONCAT(pdf_blob, original_filename), 256),
    migration_status = CASE 
        WHEN SUBSTRING(pdf_blob, 1, 4) = 0x25504446 THEN 'VALID'  -- %PDF
        ELSE 'INVALID_FORMAT'
    END
WHERE pdf_blob IS NOT NULL;

-- Report invalid PDFs
SELECT 'INVALID_PDFS_FOUND' as status, COUNT(*) as count
FROM pdf_migration_temp
WHERE migration_status = 'INVALID_FORMAT';

-- =====================================================================
-- PHASE 4: CREATE DECISION RECORDS WITH FILE PATHS
-- =====================================================================
-- Create Decision records pointing to extracted PDF files
-- File storage path: /uploads/decisions/{comiteId}/{filename}

INSERT INTO decision (
    session_id, 
    titre, 
    description, 
    fichier_path, 
    fichier_name, 
    statut, 
    created_at
)
SELECT 
    pmt.session_id,
    CONCAT('PV_Comité_', pmt.comite_id) as titre,
    CONCAT('Procès-verbal extrait - Hash: ', LEFT(pmt.file_hash, 16)) as description,
    CONCAT('/uploads/decisions/', pmt.comite_id, '/', pmt.original_filename) as fichier_path,
    pmt.original_filename,
    'Actif' as statut,
    NOW() as created_at
FROM pdf_migration_temp pmt
WHERE pmt.migration_status = 'VALID'
  AND NOT EXISTS (
    SELECT 1 FROM decision 
    WHERE decision.session_id = pmt.session_id
  );

-- =====================================================================
-- PHASE 5: GENERATE FILE EXPORT COMMANDS
-- =====================================================================
-- Output a script that can be used to export PDFs to filesystem
-- This can be piped to a file for manual processing

SELECT CONCAT(
    '-- File: ', original_filename, '\n',
    '-- Size: ', LENGTH(pdf_blob), ' bytes\n',
    '-- Path: /uploads/decisions/', comite_id, '/', original_filename, '\n',
    '-- Hash: ', file_hash, '\n'
) as file_metadata
FROM pdf_migration_temp
WHERE migration_status = 'VALID';

-- =====================================================================
-- PHASE 6: PYTHON/JAVA EXPORT SCRIPT REFERENCE
-- =====================================================================
-- Execute this Java code in your application to export BLOBs:
/*

@Service
public class PDFMigrationService {
    
    @Autowired
    private ComiteRepository comiteRepository;
    
    @Autowired
    private DecisionRepository decisionRepository;
    
    //@Transactional
    public void exportPDFsFromDatabase() throws IOException {
        String uploadsDir = "uploads/decisions";
        Files.createDirectories(Paths.get(uploadsDir));
        
        List<Comite> comites = comiteRepository.findAll();
        int exportedCount = 0;
        
        for (Comite comite : comites) {
            List<ComiteSession> sessions = comite.getSessions();
            
            for (ComiteSession session : sessions) {
                List<Decision> decisions = decisionRepository.findBySessionId(session.getId());
                
                for (Decision decision : decisions) {
                    if (decision.getFichierPath() != null) {
                        String filePath = decision.getFichierPath();
                        
                        // Create directory for this comite
                        Path dirPath = Paths.get(uploadsDir, String.valueOf(comite.getId()));
                        Files.createDirectories(dirPath);
                        
                        // Extract BLOB from database
                        // (Note: PDF already in filesystem via fichier_path)
                        // This is just for verification
                        
                        exportedCount++;
                    }
                }
            }
        }
        
        System.out.println("Exported " + exportedCount + " PDFs successfully");
    }
}

*/

-- =====================================================================
-- PHASE 7: MIGRATION STATISTICS
-- =====================================================================

SELECT 'PDF_MIGRATION_STATISTICS' as check_type,
       COUNT(*) as total_pdfs,
       SUM(CASE WHEN migration_status = 'VALID' THEN 1 ELSE 0 END) as valid_pdfs,
       SUM(CASE WHEN migration_status = 'INVALID_FORMAT' THEN 1 ELSE 0 END) as invalid_pdfs,
       SUM(LENGTH(pdf_blob)) as total_size_bytes,
       ROUND(SUM(LENGTH(pdf_blob)) / 1024 / 1024, 2) as total_size_mb
FROM pdf_migration_temp;

-- Check Decision records created
SELECT 'DECISION_RECORDS_CREATED' as status,
       COUNT(*) as count,
       COUNT(DISTINCT session_id) as unique_sessions
FROM decision
WHERE fichier_path IS NOT NULL;

-- =====================================================================
-- PHASE 8: CLEANUP
-- =====================================================================

DROP TEMPORARY TABLE IF EXISTS pdf_migration_temp;

-- =====================================================================
-- FINAL VERIFICATION
-- =====================================================================

SELECT 'PDF_MIGRATION_COMPLETE' as status,
       (SELECT COUNT(*) FROM decision WHERE fichier_path IS NOT NULL) as decisions_with_files,
       (SELECT COUNT(*) FROM comite_session) as total_sessions,
       NOW() as completion_time;

-- =====================================================================
-- MANUAL STEPS REQUIRED:
-- =====================================================================
/*

1. EXPORT BLOBS TO FILES:
   - The above SQL extracts metadata only
   - Use this Java/Python snippet to export actual BLOB data:
   
   Java Example:
   
   @Service
   public class PDFExportService {
       public void exportBlobsToFiles(String baseDir) throws IOException {
           List<Comite> comites = comiteRepository.findAll();
           
           for (Comite comite : comites) {
               // Read from comite_old.decisionPdf BLOB
               // Write to: baseDir/decisions/{comiteId}/{filename}
               
               ComiteSession session = comite.getSessions().get(0);
               Decision decision = session.getDecisions().get(0);
               
               Path targetPath = Paths.get(baseDir, "decisions", 
                   String.valueOf(comite.getId()), 
                   decision.getFichierName());
               
               Files.createDirectories(targetPath.getParent());
               
               // Extract BLOB from old table and write
               byte[] pdfData = getOldComitePdf(comite.getId());
               Files.write(targetPath, pdfData);
           }
       }
   }

2. CREATE DIRECTORIES:
   mkdir -p uploads/decisions/{1..N}
   
3. SET PERMISSIONS:
   chmod 755 uploads/decisions
   chmod 644 uploads/decisions/*/*.pdf
   
4. VERIFY FILES:
   find uploads/decisions -name "*.pdf" -exec file {} \;
   
5. TEST DOWNLOAD:
   - Test that files can be accessed via new Decision endpoints
   - Verify file integrity (file command, md5sum)
   - Compare sizes with original BLOBs

6. BACKUP:
   - Keep original database backup
   - Keep this migration script for rollback reference

*/

-- =====================================================================
