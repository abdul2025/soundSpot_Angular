import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.comonent";



@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        CommonModule,
        LoadingSpinnerComponent,
        AlertComponent,
        MaterialModule,
        AlertComponent
    ],
})

export class SharedModule {}
