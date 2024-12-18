"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const INVENTAR_1 = __importDefault(require("../tables/INVENTAR"));
const data_source_1 = __importDefault(require("../data_source"));
const USER_1 = __importDefault(require("../tables/USER"));
const DateTimeService_1 = __importDefault(require("../misc/DateTimeService"));
const PRODUS_1 = __importDefault(require("../tables/PRODUS"));
const inventar_repository = data_source_1.default.getRepository(INVENTAR_1.default);
const user_repository = data_source_1.default.getRepository(USER_1.default);
const produs_repository = data_source_1.default.getRepository(PRODUS_1.default);
class InventarController {
    static import_csv_to_inventar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const csv = req.file;
            const body_data = JSON.parse(req.body.data);
            const inventar_id = body_data.inventar_id;
            const tva = body_data.tva;
            const existing_produs_array = [];
            const dir = require('path').resolve(__dirname, '../../temp');
            var data = fs_1.default.readFileSync(dir + `/${csv === null || csv === void 0 ? void 0 : csv.filename}`)
                .toString() // convert Buffer to string
                .split('\n') // split string to lines
                .map(e => e.trim()) // remove white spaces for each line
                .map(e => e.split(',').map(e => e.trim()));
            const final_array = data.map((produs) => {
                return {
                    name: produs[0],
                    unit_measure: produs[1],
                    quantity: produs[2] === "" ? 0 : Number.parseInt(produs[2]),
                    price: produs[3] === "" ? 0 : Number.parseFloat(produs[3])
                };
            });
            yield Promise.all(final_array.map((produs, index) => __awaiter(this, void 0, void 0, function* () {
                if (produs.name.trim() !== '') {
                    const existing_produs = yield produs_repository.findOne({
                        where: {
                            name: produs.name,
                            inventar_id: inventar_id
                        }
                    }).catch((err) => {
                        res.status(500).send(err);
                        return;
                    });
                    if (existing_produs) {
                        existing_produs_array.push(existing_produs);
                    }
                    else {
                        const new_produs = new PRODUS_1.default();
                        new_produs.inventar_id = inventar_id;
                        new_produs.name = produs.name;
                        new_produs.price = Number.isNaN(produs.price) ? 0 : produs.price;
                        new_produs.quantity = Number.isNaN(produs.quantity) ? 0 : produs.quantity;
                        new_produs.tva = tva;
                        new_produs.unit_measure = produs.unit_measure;
                        new_produs.created_at = DateTimeService_1.default.format_standard_date(new Date());
                        new_produs.updated_at = DateTimeService_1.default.format_standard_date(new Date());
                        yield produs_repository.save(new_produs).catch((err) => {
                            console.log(err);
                        });
                    }
                }
                else {
                    console.log(produs, index);
                }
            })))
                .then(() => {
                res.send("Inventar updated successfully");
                return;
            });
        });
    }
    ;
    static create_inventar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_name = req.body.user_name;
            const inventar_name = req.body.inventar_name;
            if (inventar_name === null || inventar_name === undefined) {
                res.status(401).send("Name cannot be empty");
                return;
            }
            const existing_inventar = yield inventar_repository.findOne({
                where: {
                    iventar_name: inventar_name
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            if (existing_inventar) {
                res.status(400).send("Inventar already exists");
                return;
            }
            else {
                const user = yield user_repository.findOne({
                    where: {
                        user_name: user_name
                    }
                }).catch((err) => {
                    res.status(500).send(err);
                    return;
                });
                const new_inventar = new INVENTAR_1.default();
                new_inventar.iventar_name = inventar_name;
                new_inventar.created_by = user.user_id;
                new_inventar.created_at = DateTimeService_1.default.format_standard_date(new Date());
                new_inventar.updated_at = DateTimeService_1.default.format_standard_date(new Date());
                yield inventar_repository.save(new_inventar).catch((err) => {
                    res.status(500).send(err);
                    return;
                });
                res.send("Inventar created successfully");
                return;
            }
        });
    }
    ;
    static get_inventare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventare = yield inventar_repository.find().catch((err) => {
                res.status(500).send(err);
                return;
            });
            res.send(inventare);
            return;
        });
    }
    ;
    static get_inventar_products(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventar_id = req.body.inventar_id;
            const inventar = yield inventar_repository.findOne({
                where: {
                    inventar_id: inventar_id
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            const produse = yield produs_repository.find({
                where: {
                    inventar_id: inventar.inventar_id
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            const final_produs_array = produse.map((produs) => {
                return Object.assign(Object.assign({}, produs), { total: produs.price * produs.quantity });
            });
            const final_response = Object.assign(Object.assign({}, inventar), { produse: final_produs_array });
            res.send(final_response);
            return;
        });
    }
    static add_produs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const produs_name = req.body.produs_name;
            const produs_unit_measure = req.body.produs_unit_measure;
            const produs_quantity = req.body.produs_quantity;
            const produs_price = req.body.produs_price;
            const produs_tva = req.body.produs_tva;
            const inventar_id = req.body.inventar_id;
            const existing_produs = yield produs_repository.findOne({
                where: {
                    name: produs_name,
                    inventar_id: inventar_id
                }
            });
            if (existing_produs) {
                res.status(400).send("Produs already added");
                return;
            }
            else {
                const new_produs = new PRODUS_1.default();
                new_produs.name = produs_name;
                new_produs.price = produs_price;
                new_produs.quantity = produs_quantity;
                new_produs.tva = produs_tva;
                new_produs.unit_measure = produs_unit_measure;
                new_produs.created_at = DateTimeService_1.default.format_standard_date(new Date());
                new_produs.updated_at = DateTimeService_1.default.format_standard_date(new Date());
                new_produs.inventar_id = inventar_id;
                yield produs_repository.save(new_produs).catch((err) => {
                    res.status(500).send(err);
                    return;
                });
                res.send("Produs added successfully");
                return;
            }
        });
    }
    static delete_produs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const produs_id = req.body.produs_id;
            yield produs_repository.delete({
                produs_id: produs_id
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            res.send("Produs deleted successfully");
            return;
        });
    }
    static update_produs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const new_produs_details = req.body.new_produs_details;
            const found_produs = yield produs_repository.findOne({
                where: {
                    produs_id: new_produs_details.produs_id
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            found_produs.name = new_produs_details.new_name;
            found_produs.price = new_produs_details.new_price;
            found_produs.quantity = new_produs_details.new_quantity;
            found_produs.tva = new_produs_details.new_tva;
            found_produs.unit_measure = new_produs_details.new_unit_measure;
            yield produs_repository.save(found_produs).catch((err) => {
                res.status(500).send(err);
                return;
            });
            res.send("Produs updated successfully");
            return;
        });
    }
    static import_products_to_inventar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const new_inventar_id = req.body.new_inventar_id;
            const selected_products = req.body.selected_products;
            const new_products = [];
            selected_products.forEach((produs) => {
                produs.inventar_id = new_inventar_id;
                new_products.push(produs);
            });
            res.send(new_products);
        });
    }
}
exports.default = InventarController;
