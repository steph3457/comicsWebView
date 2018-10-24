import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Config } from "../lib/Config";
import { Filter } from "../lib/Filter";
import { Comic } from "../lib/Comic";
import { ReadingStatus } from "../lib/ReadingStatus";
import { EnvironmentService } from "./environment.service";
import { Sort, MatSnackBar } from '@angular/material';

@Injectable()
export class LibraryService {
    backend: string = "";
    comics: Comic[] = [];
    config: Config = new Config(null);
    comicsComparer: (c1: Comic, c2: Comic) => number = Comic.ComicTitleComparer;
    comicsReverse: boolean = false;
    filter: Filter = new Filter();
    readingStatus: ReadingStatus = new ReadingStatus(null);

    constructor(private http: HttpClient, private router: Router, private environment: EnvironmentService, public snackBar: MatSnackBar) {
        this.backend = environment.backendURL;
        this.http.get(this.backend + "/api/comics").subscribe(res => {
            this.comics = res as Comic[];
        });
        this.http.get(this.backend + "/api/config").subscribe(res => {
            var config = res as Config;
            this.config = new Config(config);
        });
    }

    parseComics() {
        this.snackBar.open("Parsing comics", "pending...", { verticalPosition: "top" });
        this.http.get(this.backend + "/api/comics/parse").subscribe(res => {
            this.comics = res as Comic[];
            this.snackBar.open("Parsing comics", "complete", { verticalPosition: "top", duration: 2000 });
        });
    }
    parseIssues() {
        this.snackBar.open("Parsing issues", "pending...", { verticalPosition: "top" });
        this.http.get(this.backend + "/api/issues/parse").subscribe(res => {
            this.comics = res as Comic[];
            this.snackBar.open("Parsing issues", "complete", { verticalPosition: "top", duration: 2000 });
        });
    }
    saveConfig() {
        this.snackBar.open("Save config", "pending...", { verticalPosition: "top" });
        this.http.post(this.backend + "/api/config", this.config).subscribe(res => {
            this.snackBar.open("Save config", "complete", { verticalPosition: "top", duration: 2000 });
        });
    }
    displayComic(comic: Comic) {
        this.router.navigate(["/comic", comic.id]);
        window.scrollTo(0, 0);
    }

    findExactMapping() {
        this.snackBar.open("Search comics infos", "pending...", { verticalPosition: "top" });
        this.http.get(this.backend + "/api/comics/findExactMapping").subscribe(res => {
            this.comics = res as Comic[];
            this.snackBar.open("Search comics infos", "complete", { verticalPosition: "top", duration: 2000 });
        });
    }
    updateComicsInfos() {
        this.snackBar.open("Update comics infos", "pending...", { verticalPosition: "top" });
        this.http.get(this.backend + "/api/comics/updateInfos").subscribe(res => {
            this.comics = res as Comic[];

            this.snackBar.open("Update comics infos", "complete", { verticalPosition: "top", duration: 2000 });
        });
    }
    getInProgressComics() {
        let comics: Comic[] = [];
        let filter = new Filter();
        filter.restriction = "inprogress";
        for (const i in this.comics) {
            if (filter.match(this.comics[i])) {
                comics.push(this.comics[i]);
            }
        }
        comics = comics.sort(Comic.ComicTitleComparer);
        return comics;
    }
    getComics(): Comic[] {
        let comics: Comic[] = [];
        for (let i in this.comics) {
            if (this.filter.match(this.comics[i])) {
                comics.push(this.comics[i]);
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
