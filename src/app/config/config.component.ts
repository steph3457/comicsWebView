import { Form } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LibraryService } from "src/app/library.service";
import { HttpClient } from "@angular/common/http";
import { Comic } from "src/lib/Comic";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: "app-config",
    templateUrl: "./config.component.html",
    styleUrls: ["./config.component.scss"]
})
export class ConfigComponent implements OnInit {
    comicTitle: string;
    comicYear: string;

    constructor(
        public libraryService: LibraryService,
        private http: HttpClient,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit() { }

    createComic() {
        this.snackBar.open("Creating comic", "pending...", { verticalPosition: "top" });
        this.http
            .post(this.libraryService.backend + "/api/comics/create", {
                comicTitle: this.comicTitle,
                comicYear: this.comicYear
            })
            .subscribe(res => {
                this.libraryService.comics = res as Comic[];
                this.snackBar.open("Comic created", "complete", { verticalPosition: "top", duration: 2000 });
            });
    }
}
