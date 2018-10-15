import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Config } from "../lib/Config";
import { Filter } from "../lib/Filter";
import { NotificationsService } from "angular2-notifications";
import { Comic } from "../lib/Comic";
import { ReadingStatus } from "../lib/ReadingStatus";
import { EnvironmentService } from "./environment.service";
import { Sort } from '@angular/material';

@Injectable()
export class LibraryService {
    backend: string = "";
    comics: Comic[] = [];
    config: Config = new Config(null);
    comicsComparer: (c1: Comic, c2: Comic) => number = Comic.ComicTitleComparer;
    comicsReverse: boolean = false;
    filter: Filter = new Filter();
    readingStatus: ReadingStatus = new ReadingStatus(null);

    constructor (private http: HttpClient, private router: Router, private environment: EnvironmentService) {
        this.backend = environment.backendURL;
        this.http.get(this.backend + "/api/comics").subscribe(res => {
            this.comics = res as Comic[];
        });
        this.http.get(this.backend + "/api/config").subscribe(res => {
            var config = res as Config;
            this.config = new Config(config);
        });
    }

    parseComics(notificationsService: NotificationsService) {
        let notif = notificationsService.info("Parsing comics", "pending...");
        this.http.get(this.backend + "/api/comics/parse").subscribe(res => {
            this.comics = res as Comic[];
            notificationsService.remove(notif.id);
            notificationsService.success("Parsing comics", "complete", {
                timeOut: 2000
            });
        });
    }
    parseIssues(notificationsService: NotificationsService) {
        let notif = notificationsService.info("Parsing issues", "pending...");
        this.http.get(this.backend + "/api/issues/parse").subscribe(res => {
            this.comics = res as Comic[];
            notificationsService.remove(notif.id);
            notificationsService.success("Parsing issues", "complete", {
                timeOut: 2000
            });
        });
    }
    saveConfig(notificationsService: NotificationsService) {
        let notif = notificationsService.info("Save config", "pending...");
        this.http.post(this.backend + "/api/config", this.config).subscribe(res => {
            notificationsService.remove(notif.id);
            notificationsService.success("Save config", "complete", {
                timeOut: 2000
            });
        });
    }
    displayComic(comic: Comic) {
        this.router.navigate([ "/comic", comic.id ]);
        window.scrollTo(0, 0);
    }

    findExactMapping(notificationsService: NotificationsService) {
        let notif = notificationsService.info(
            "Search comics infos",
            "pending..."
        );
        this.http.get(this.backend + "/api/comics/findExactMapping").subscribe(res => {
            this.comics = res as Comic[];
            notificationsService.remove(notif.id);
            notificationsService.success("Search comics infos", "complete", {
                timeOut: 2000
            });
        });
    }
    updateComicsInfos(notificationsService: NotificationsService) {
        let notif = notificationsService.info(
            "Update comics infos",
            "pending..."
        );
        this.http.get(this.backend + "/api/comics/updateInfos").subscribe(res => {
            this.comics = res as Comic[];
            notificationsService.remove(notif.id);
            notificationsService.success("Update comics infos", "complete", {
                timeOut: 2000
            });
        });
    }
    getInProgressComics() {
        let comics: Comic[] = [];
        let filter = new Filter();
        filter.restriction = "inprogress";
        for (const i in this.comics) {
            if (filter.match(this.comics[ i ])) {
                comics.push(this.comics[ i ]);
            }
        }
        comics = comics.sort(Comic.ComicTitleComparer);
        return comics;
    }
    getComics(): Comic[] {
        let comics: Comic[] = [];
        for (let i in this.comics) {
            if (this.filter.match(this.comics[ i ])) {
                comics.push(this.comics[ i ]);
            }
        }
        comics = comics.sort(this.comicsComparer);
        if (this.comicsReverse) {
            comics = comics.reverse();
        }
        return comics;
    }
    sortBy(sort: Sort) {
        if (sort.active && sort.direction) {
            switch (sort.active) {
                case "title": {
                    if (this.comicsComparer === Comic.ComicTitleComparer) {
                        this.comicsReverse = !this.comicsReverse;
                    }
                    this.comicsComparer = Comic.ComicTitleComparer;
                    break;
                }
                case "year": {
                    if (this.comicsComparer === Comic.ComicYearComparer) {
                        this.comicsReverse = !this.comicsReverse;
                    }
                    this.comicsComparer = Comic.ComicYearComparer;
                    break;
                }
                default:
                    break;
            }
        }
    }
}
