import { UserEntity } from './user.entity';
export declare class LogActivityEntity {
    id: number;
    user: UserEntity | null;
    action: string | null;
    dateAction: Date;
}
