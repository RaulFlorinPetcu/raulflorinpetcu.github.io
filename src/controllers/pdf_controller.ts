import { Request, Response } from "express";
import INVENTAR from "../tables/INVENTAR";
import ServerDataSource from "../data_source";
import PRODUS from "../tables/PRODUS";
import puppeteer from "puppeteer";
import FileManager from "../misc/FileManager";

const inventar_repository = ServerDataSource.getRepository(INVENTAR);
const produs_repository = ServerDataSource.getRepository(PRODUS);

class PdfController {
    static async generate_pdf(req: Request, res: Response) {

        const inventar_id = req.body.inventar_id;
    
        const inventar = await inventar_repository.findOne({
            where: {
                inventar_id: inventar_id
            }
        })
        .catch((err) => {
            res.status(500).send(err);
            return;
        })
    
        if(!inventar) {
            res.status(500).send("Inventar not found");
            return;
        }
        else {
            const products = await produs_repository.find({
                where: {
                    inventar_id: inventar_id
                }
            })
            .catch((err) => {
                res.status(500).send(err);
                return;
            })
    
            if(products) {

                const table_rows: Array<string> = [];
                let totalTVA = 0;
                let totalPriceWithoutTVA = 0;
                let totalPriceWithTVA = 0;

                products.sort((a:any, b:any) => {
                    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                  
                    // names must be equal
                    return 0;
                }).forEach((product) =>{
                    totalTVA += (product.price * product.quantity) * (product.tva/100);
                    totalPriceWithoutTVA += product.price * product.quantity;
                    totalPriceWithTVA += (product.price * product.quantity) + ((product.price * product.quantity) * (product.tva/100));

                    table_rows.push(
                        `
                        <tr>
                            <td>
                                ${product.name}
                            </td>
                            <td>
                                ${product.unit_measure}
                            </td>
                            <td>
                                ${product.quantity}
                            </td>
                            <td>
                                ${product.price}
                            </td>
                            <td>
                                ${product.tva}
                            </td>
                            <td>
                                ${((product.price * product.quantity) * (product.tva/100)).toFixed(2)}
                            </td>
                            <td>
                                ${(product.price * product.quantity).toFixed(2)}
                            </td>
                            <td>
                                ${((product.price * product.quantity) + ((product.price * product.quantity) * (product.tva/100))).toFixed(2)}
                            </td>
                        </tr>
                        `
                    )
                });

                const html_template = 
                `
                <html>
                    <head>
                        <title>PDF Raport</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .document_title {
                                display: inline-flex;
                                align-items: center;
                                justify-items: center;
                                width: 100%;
                                text-align: center;
                            }
                            .title_text {
                                margin: auto;
                                width: fit;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse !important;
                                margin-top: 20px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                                font-size: 14px !important;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="document_title">
                            <h1 class="title_text">ILDIRO NABRES SRL</h1>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text">827/514/2020</h2>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text">CUI: RO42718449 - GÂRCINA</h2>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text" style="margin-top: 40px">${inventar.iventar_name}</h2>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Nume produs
                                    </th>
                                    <th>
                                        Unitate Măsură
                                    </th>
                                    <th>
                                        Cantitate
                                    </th>
                                    <th>
                                        Preț (RON)
                                    </th>
                                    <th>
                                        TVA (%)
                                    </th>
                                    <th>
                                        TVA (RON)
                                    </th>
                                    <th>
                                        Valoare RON (Fără TVA)
                                    </th>
                                    <th>
                                        Valoare RON (Plus TVA)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${table_rows.join("")}
                                <tr>
                                    <td colspan="5">
                                        Total
                                    </td>
                                    <td>
                                        ${totalTVA.toFixed(2)}
                                    </td>
                                    <td>
                                        ${totalPriceWithoutTVA.toFixed(2)}
                                    </td>
                                    <td>
                                        ${totalPriceWithTVA.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                </html>
                `;
    
                const browser = await puppeteer.launch({
                    headless: true
                });
                const page = await browser.newPage();
    
                await page.setContent(html_template);

                const date = new Date().toLocaleDateString();
                const time = new Date().toTimeString().slice(0, 8);

                const unique_identifier = new Date().getTime();

                console.log(process.cwd())
    
                // Generate PDF for the report
                await page.pdf({ 
                    path: `${process.cwd()}/temp/pdf_generated_files/report_${unique_identifier}.pdf`, 
                    format: "A4", 
                    displayHeaderFooter: true,
                    // headerTemplate: '<div id="header-template" style="font-size:12px !important; color:#808080; padding-left:10px"><span class="date"></span></div>',
                    headerTemplate: `<div id="header-template" style="font-size:12px !important; color:#808080; padding-left:10px">${date} ${time}</div>`,
                    footerTemplate: '<div id="footer-template" style="font-size:16px !important; color:#808080; padding-left:10px"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
                    margin: {
                        top: '60px', right: '20px', bottom: '60px', left: '20px'
                    }
                });
    
                await browser.close();


    
                res.sendFile(`report_${unique_identifier}.pdf`, {root:`${process.cwd()}temp/pdf_generated_files/`}, (err) =>{
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        // FileManager.delete_file(`temp/pdf_generated_files/report_${unique_identifier}.pdf`)
                    }
                });
            }
        }
    }
}

export default PdfController;