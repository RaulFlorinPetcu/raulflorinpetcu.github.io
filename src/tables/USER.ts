import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique("USER_UNIQUE_user_name", ["user_name"])
class USER {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({nullable: true})
    user_name: string

    @Column({nullable: true, length: 255})
    password_hash: string;

    @Column({nullable: true})
    created_at: string;

    @Column({nullable: true})
    updated_at: string;
}

export default USER;