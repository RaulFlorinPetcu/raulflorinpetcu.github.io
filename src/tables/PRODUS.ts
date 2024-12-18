import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class PRODUS {
    @PrimaryGeneratedColumn()
    produs_id: number;

    @Column({nullable: true})
    inventar_id: number;

    @Column({nullable: true})
    name: string

    @Column({nullable: true})
    unit_measure: string;

    @Column({nullable: true})
    quantity: number;

    @Column({nullable: true, type: "float"})
    price: number;

    @Column({nullable: true})
    tva: number;

    @Column({nullable: true})
    created_at: string;

    @Column({nullable: true})
    updated_at: string;
};

export default PRODUS;