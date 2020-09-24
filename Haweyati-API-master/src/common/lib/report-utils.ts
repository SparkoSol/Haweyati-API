import * as carbone from 'carbone'
import { Readable } from "stream";

export class ReportUtils {
   static readonly PATH = '../report_templates/';

   static renderReport(name: string, data: any): Promise<Readable> {
      return new Promise<Readable>((resolve, reject) => {
         carbone.render(this.PATH + name, data, { convertTo : 'pdf' }, (err, result) => {
            if (err) reject(err);
            else {
               const stream = new Readable();
               stream.push(result)
               stream.push(null)
               resolve(stream);
            }
         })
      })
   }
}