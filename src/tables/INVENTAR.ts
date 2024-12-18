import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class INVENTAR {
    @PrimaryGeneratedColumn()
    inventar_id: number;

    @Column({nullable: true})
    created_by: number

    @Column({nullable: true})
    iventar_name: string;

    @Column({nullable: true})
    created_at: string;

    @Column({nullable: true})
    updated_at: string;
}

export default INVENTAR;