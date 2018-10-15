import { Form } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LibraryService } from "src/app/library.service";
import { NotificationsService } from "angular2-notifications";
import { HttpClient } from "@angular/common/http";
import { Comic } from "src/lib/Comic";

@Component({
    selector: "app-config",
    templateUrl: "./config.component.html",
    styleUrls: [ "./config.component.scss" ]
})
export class ConfigComponent implements OnInit {
    comicTitle: string;
    comicYear: string;

    constructor (
        public libraryService: LibraryService,
        public notificationsService: NotificationsService,
        private http: HttpClient
    ) { }

    ngOnInit() { }

    createComic() {
        let notif = this.notificationsService.info(
            "Creating comic",
            "pending..."
        );
        this.http
            .post(this.libraryService.backend + "/api/comics/create", {
                comicTitle: this.comicTitle,
                comicYear: this.comicYear
            })
            .subscribe(res => {
                this.libraryService.comics = res as Comic[];
                this.notificationsService.remove(notif.id);
                this.notificationsService.success("Comic created", "complete", {
                    timeOut: 2000
                });
            });
    }
}
