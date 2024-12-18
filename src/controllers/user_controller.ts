import { Request, Response } from "express";
import USER from "../tables/USER";
import ServerDataSource from "../data_source";
import { Encrypt } from "../misc/Encrypt";
import DateTimeService from "../misc/DateTimeService";
import ConsoleLogger from "../misc/ConsoleLogger";
import jsonwebtoken from 'jsonwebtoken';

const user_repository = ServerDataSource.getRepository(USER);

class UserController {
    static async register_user(req: Request, res: Response) {
        const user_name = req.body.user_name;
        const password = req.body.password;

        const password_hash = await Encrypt.cryptPassword(password);

        const user = new USER();
        user.user_name = user_name;
        user.password_hash = password_hash;
        user.created_at = DateTimeService.format_standard_date(new Date());
        user.updated_at = DateTimeService.format_standard_date(new Date());

        const existing_user = await user_repository.findOne({
            where: {
                user_name: user_name
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        if(existing_user) {
            res.status(400).send("User already exists")
            return;
        }

        await user_repository.save(user)
        .catch((err) => {
            res.status(500).send(err);
            return;
        })

        res.send(user);
        return;
    }

    static async login_user(req: Request, res: Response) {
        const user_name = req.body.user_name;
        const password = req.body.password;

        const db_user = await user_repository.findOne({
            where: {
                user_name: user_name
            }
        }).catch((err) => {
            res.status(500).send(err);
            return;
        });

        if(!db_user) {
            res.status(401).send("Invalid credentials");
            return;
        }

        const is_password_valid = await Encrypt.comparePassword(password, db_user!.password_hash);

        if(is_password_valid === false) {
            res.status(401).send("Invalid credentials");
            return;
        }
        else {
            const new_token = await jsonwebtoken.sign({
                user_id: db_user!.user_id
            }, "GwWifouXZnV43M0MuKROBmerk4xwbH6M");

            res.send(new_token);
            return;
        }
    }
}

export default UserController;