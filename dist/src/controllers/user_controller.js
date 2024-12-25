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
const USER_1 = __importDefault(require("../tables/USER"));
const data_source_1 = __importDefault(require("../data_source"));
const Encrypt_1 = require("../misc/Encrypt");
const DateTimeService_1 = __importDefault(require("../misc/DateTimeService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository = data_source_1.default.getRepository(USER_1.default);
class UserController {
    static register_user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_name = req.body.user_name;
            const password = req.body.password;
            const password_hash = yield Encrypt_1.Encrypt.cryptPassword(password);
            const user = new USER_1.default();
            user.user_name = user_name;
            user.password_hash = password_hash;
            user.created_at = DateTimeService_1.default.format_standard_date(new Date());
            user.updated_at = DateTimeService_1.default.format_standard_date(new Date());
            const existing_user = yield user_repository.findOne({
                where: {
                    user_name: user_name
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            if (existing_user) {
                res.status(400).send("User already exists");
                return;
            }
            yield user_repository.save(user)
                .catch((err) => {
                res.status(500).send(err);
                return;
            });
            res.send(user);
            return;
        });
    }
    static login_user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_name = req.body.user_name;
            const password = req.body.password;
            const db_user = yield user_repository.findOne({
                where: {
                    user_name: user_name
                }
            }).catch((err) => {
                res.status(500).send(err);
                return;
            });
            if (!db_user) {
                res.status(401).send("Invalid credentials");
                return;
            }
            const is_password_valid = yield Encrypt_1.Encrypt.comparePassword(password, db_user.password_hash);
            if (is_password_valid === false) {
                res.status(401).send("Invalid credentials");
                return;
            }
            else {
                const new_token = yield jsonwebtoken_1.default.sign({
                    user_id: db_user.user_id,
                    user_name: user_name
                }, "GwWifouXZnV43M0MuKROBmerk4xwbH6M");
                res.send(new_token);
                return;
            }
        });
    }
}
exports.default = UserController;
