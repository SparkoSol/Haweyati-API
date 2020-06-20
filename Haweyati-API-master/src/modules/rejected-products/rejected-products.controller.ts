import { Controller } from '@nestjs/common';
import {SimpleController} from "../../common/lib/simple.controller";
import {IRejectedShops} from "../../data/interfaces/rejectedShops.interface";
import {IRejectedProducts} from "../../data/interfaces/rejectedProducts.interface";
import {RejectedProductsService} from "./rejected-products.service";

@Controller('rejected-products')
export class RejectedProductsController extends SimpleController<IRejectedProducts>{
    constructor(protected readonly service: RejectedProductsService) {
        super(service);
    }
}
