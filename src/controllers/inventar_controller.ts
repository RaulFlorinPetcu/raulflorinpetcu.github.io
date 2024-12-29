import { Request, Response } from "express";
import fs from 'fs';
import CsvProdus from "../interfaces/CsvProdus";
import INVENTAR from "../tables/INVENTAR";
import ServerDataSource from "../data_source";
import USER from "../tables/USER";
import DateTimeService from "../misc/DateTimeService";
import PRODUS from "../tables/PRODUS";
import NewProdusDetails from "../interfaces/NewProdusDetails";
import Produs from "../interfaces/Produs";

const inventar_repository = ServerDataSource.getRepository(INVENTAR);
const user_repository = ServerDataSource.getRepository(USER);
const produs_repository = ServerDataSource.getRepository(PRODUS);

class InventarController {
    static async import_csv_to_inventar(req: Request, res: Response) {
        const csv = req.file;
        const body_data = JSON.parse(req.body.data);

        
        const inventar_id = body_data.inventar_id;
        const tva = body_data.tva;
        const existing_produs_array: Array<PRODUS> = [];

        const dir = require('path').resolve(__dirname, '../../temp');

        var data = fs.readFileSync(dir + `/${csv?.filename}`)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim()));


        const final_array: Array<CsvProdus> = data.map((produs) => {
            return {
                name: produs[0],
                unit_measure: produs[1],
                quantity: produs[2] === "" ? 0 : Number.parseInt(produs[2]),
                price: produs[3] === "" ? 0 : Number.parseFloat(produs[3])
            }
        });

        await Promise.all(final_array.map(async (produs, index) => {
            if(produs.name.trim() !== '') {
                const existing_produs = await produs_repository.findOne({
                    where: {
                        name: produs.name,
                        inventar_id: inventar_id
                    }
                }).catch((err) => {
                    res.status(500).send(err);
                    return;
                });
    
                if(existing_produs) {
                    existing_produs_array.push(existing_produs);
                }
                else {
                    const new_produs = new PRODUS();
                    new_produs.inventar_id = inventar_id;
                    new_produs.name = produs.name;
                    new_produs.price = Number.isNaN(produs.price) ? 0 : produs.price;
                    new_produs.quantity = Number.isNaN(produs.quantity) ? 0 : produs.quantity;
                    new_produs.tva = tva;
                    new_produs.unit_measure = produs.unit_measure;
                    new_produs.created_at = DateTimeService.format_standard_date(new Date());
                    new_produs.updated_at = DateTimeService.format_standard_date(new Date());
    
                    await produs_repository.save(new_produs).catch((err) => {
                        console.log(err)
                    });
                }
            }
            else {
                console.log(produs, index)
            }
        }))
        .then(() => {
            res.send("Inventar updated successfully");
            return;
        });
    };

    static async create_inventar(req: Request, res: Response) {
        const user_name = req.body.user_name;
        const inventar_name = req.body.inventar_name;
        const inventar_tva = req.body.inventar_tva;

        if(inventar_name === null || inventar_name === undefined) {
            res.status(401).send("Name cannot be empty");
            return
        }

        const existing_inventar = await inventar_repository.findOne({
            where: {
                iventar_name: inventar_name
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        if(existing_inventar) {
            res.status(400).send("Inventar already exists")
            return;
        }
        else {

            const user = await user_repository.findOne({
                where: {
                    user_name: user_name
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });

            const new_inventar = new INVENTAR();
            new_inventar.iventar_name = inventar_name
            new_inventar.inventar_tva = inventar_tva;
            new_inventar.created_by = user!.user_id;
            new_inventar.created_at = DateTimeService.format_standard_date(new Date());
            new_inventar.updated_at = DateTimeService.format_standard_date(new Date());

            await inventar_repository.save(new_inventar).catch((err) => {
                res.status(500).send(err);
                return;
            });

            res.send("Inventar created successfully");
            return;
        }
    };

    static async get_inventare(req: Request, res: Response) {
        const inventare = await inventar_repository.find().catch((err) => {
            res.status(500).send(err);
            return;
        });
        res.send(inventare);
        return;
    };

    static async get_inventar_products(req: Request, res: Response) {
        const inventar_id = req.body.inventar_id;

        const inventar = await inventar_repository.findOne({
            where: {
                inventar_id: inventar_id
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        const produse = await produs_repository.find({
            where: {
                inventar_id: inventar!.inventar_id
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        const final_produs_array = produse!.map((produs) => {
            return {
                ...produs,
                total: produs.price * produs.quantity
            }
        });

        const final_response = {
            ...inventar,
            produse: final_produs_array
        };



        res.send(final_response);
        return;
    }

    static async add_produs(req: Request, res: Response) {
        const produs_name = req.body.produs_name;
        const produs_unit_measure = req.body.produs_unit_measure;
        const produs_quantity = req.body.produs_quantity;
        const produs_price = req.body.produs_price;
        const produs_tva = req.body.produs_tva;
        const inventar_id = req.body.inventar_id;


        const existing_produs = await produs_repository.findOne({
            where: {
                name: produs_name,
                inventar_id: inventar_id
            }
        });

        if(existing_produs) {
            res.status(400).send("Produs already added");
            return;
        }
        else {
            const new_produs = new PRODUS();
            new_produs.name = produs_name;
            new_produs.price = produs_price;
            new_produs.quantity = produs_quantity;
            new_produs.tva = produs_tva;
            new_produs.unit_measure = produs_unit_measure;
            new_produs.created_at = DateTimeService.format_standard_date(new Date());
            new_produs.updated_at = DateTimeService.format_standard_date(new Date());
            new_produs.inventar_id = inventar_id;

            await produs_repository.save(new_produs).catch((err) => {
                res.status(500).send(err);
                return;
            });

            res.send("Produs added successfully");
            return;
        }
    }

    static async delete_produs(req: Request, res: Response) {
        const produs_id = req.body.produs_id;

        await produs_repository.delete({
            produs_id: produs_id
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        res.send("Produs deleted successfully");
        return;
    }

    static async update_produs(req: Request, res: Response) {
        const new_produs_details: NewProdusDetails = req.body.new_produs_details;

        const found_produs = await produs_repository.findOne({
            where: {
                produs_id: new_produs_details.produs_id
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        found_produs!.name = new_produs_details.new_name;
        found_produs!.price = new_produs_details.new_price;
        found_produs!.quantity = new_produs_details.new_quantity;
        found_produs!.tva = new_produs_details.new_tva;
        found_produs!.unit_measure = new_produs_details.new_unit_measure;

        await produs_repository.save(found_produs!).catch((err) => {
            res.status(500).send(err);
            return;
        });

        res.send("Produs updated successfully");
        return;
    }

    static async import_products_to_inventar(req: Request, res: Response) {
        const new_inventar_id = req.body.new_inventar_id;
        const selected_products: Array<Produs> = req.body.selected_products;


        await Promise.all(selected_products.map(async (produs, index) => {
            const new_produs = new PRODUS();
            new_produs.name = produs.name;
            new_produs.price = produs.price;
            new_produs.quantity = produs.quantity;
            new_produs.tva = produs.tva;
            new_produs.unit_measure = produs.unit_measure;
            new_produs.created_at = DateTimeService.format_standard_date(new Date());
            new_produs.updated_at = DateTimeService.format_standard_date(new Date());
            new_produs.inventar_id = new_inventar_id;

            await produs_repository.save(new_produs!).catch((err) => {
                res.status(500).send(err);
                return;
            });
        }))
        .then(() => {
            res.send("New products imported")
        })
    }

    static async delete_inventar(req: Request, res: Response) {
        const inventar_id = req.body.inventar_id;
        
        await inventar_repository.delete({
            inventar_id: inventar_id
        }).catch((err) => {
            res.status(500).send(err);
            return
        })

        res.send("Inventar deleted")
        return
    }
}

export default InventarController;