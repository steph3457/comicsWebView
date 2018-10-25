import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../library.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comic } from '../../lib/Comic';
import { Issue } from '../../lib/Issue';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material';
import { ReadingStatus } from 'src/lib/ReadingStatus';


@Component({
  selector: 'app-comic-details',
  templateUrl: './comic-details.component.html',
  styleUrls: ['./comic-details.component.scss']
})
export class ComicDetailsComponent implements OnInit {

  displayedColumns: string[] = ['Image', "Number", "FileName", 'Title', 'Date', 'Read'];

  edit: boolean = false;
  comic: Comic = new Comic(null);
  constructor(
    public libraryService: LibraryService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  toggleEditMode() {
    this.edit = !this.edit;
    if (this.edit) {
      this.displayedColumns = ['Image', "EditNumber", "Move", 'Title', 'Date', "Read", "Delete"];
    }
    else {
      this.displayedColumns = ['Image', "Number", "FileName", 'Title', 'Date', 'Read'];
    }
  }

  read(issue: Issue) {
    if (issue.possessed && !this.edit) {
      this.libraryService.readingStatus = issue.readingStatus;
      this.router.navigate(['/reader', issue.id]);
    }
  }

  markAllRead() {
    for (let issueId in this.comic.issues) {
      let issue = this.comic.issues[issueId];
      this.markRead(issue);
    }
  }
  markRead(issue: Issue) {
    this.snackBar.open("Mark comic as read", "pending...", { verticalPosition: "top" });
    issue.readingStatus.read = !issue.readingStatus.read;
    this.http.post(this.libraryService.backend + '/api/readingStatus', issue.readingStatus).subscribe(res => {
      this.snackBar.open("Mark comic as read", "complete", { verticalPosition: "top", duration: 2000 });
    });
  }

  updateComicInfos() {
    this.snackBar.open("Update comic infos", "pending...", { verticalPosition: "top" });
    this.http.get(this.libraryService.backend + '/api/comic/' + this.comic.id + '/updateInfos').subscribe(res => {
      this.comic = new Comic(res as Comic);
      this.snackBar.open("Update comic infos", "complete", { verticalPosition: "top", duration: 2000 });
    });
  }
  updateComicVineId() {
    this.snackBar.open("Update comic infos", "pending...", { verticalPosition: "top" });
    if (this.comic.comicVineId) {
      this.http.post(this.libraryService.backend + '/api/comic/' + this.comic.id + '/updateComicVineId', { comicVineId: this.comic.comicVineId }).subscribe(res => {
        this.comic = new Comic(res as Comic);
        this.snackBar.open("Update comic infos", "complete", { verticalPosition: "top", duration: 2000 });
      });
    }
  }

  setFinished(finished: boolean) {
    this.snackBar.open("Update comic finished", "pending...", { verticalPosition: "top" });
    this.http.post(this.libraryService.backend + '/api/comic/' + this.comic.id + '/updateFinished', { finished: finished }).subscribe(res => {
      this.comic = new Comic(res as Comic);
      this.snackBar.open("Update comic finished", "complete", { verticalPosition: "top", duration: 2000 });
    });
  }

  deleteIssue(issueId) {
    this.snackBar.open("Delete issue", "pending...", { verticalPosition: "top" });
    this.http.delete(this.libraryService.backend + '/api/issue/' + issueId).subscribe(res => {
      for (let issueIndex in this.comic.issues) {
        if (this.comic.issues[issueIndex].id === issueId) {
          delete this.comic.issues[issueIndex];
        }
      }
      this.snackBar.open("Delete issue", "complete", { verticalPosition: "top", duration: 2000 });
    });
  }

  updateIssueComic(comicId, issueId) {
    this.snackBar.open("Update issue comic", "pending...", { verticalPosition: "top" });
    this.http
      .post(this.libraryService.backend + "/api/issue/" + issueId + "/updateComic", {
        comicId: comicId
      })
      .subscribe(res => {
        let requestResponse = res as RequestResponse;
        if (requestResponse.status === "success") {
          for (let issueIndex in this.comic.issues) {
            if (this.comic.issues[issueIndex].id === issueId) {
              delete this.comic.issues[issueIndex];
            }
          }
          this.snackBar.open("Update issue comic", requestResponse.message, { verticalPosition: "top", duration: 2000 });
        }
        else {
          this.snackBar.open("Update issue comic", requestResponse.message, { verticalPosition: "top", duration: 2000 });
        }
      });
  }
  updateIssueNumber(issueNumber, issueId) {
    this.snackBar.open("Update issue number", "pending...", { verticalPosition: "top" });
    this.http
      .post(this.libraryService.backend + "/api/issue/" + issueId + "/updateNumber", {
        issueNumber: issueNumber
      })
      .subscribe(res => {
        let requestResponse = res as RequestResponse;
        if (requestResponse.status === "success") {
          for (let issueIndex in this.comic.issues) {
            if (this.comic.issues[issueIndex].id === issueId) {
              this.comic.issues[issueIndex].number = issueNumber;
            }
          }
          this.snackBar.open("Update issue number", requestResponse.message, { verticalPosition: "top", duration: 2000 });
        }
        else {
          this.snackBar.open("Update issue number", requestResponse.message, { verticalPosition: "top", duration: 2000 });
        }
      });
  }
  getSpinnerProgress(readingStatus: ReadingStatus) {
    if (readingStatus.read) {
      return 100;
    }
    if (readingStatus.pageCount > 0) {
      return (readingStatus.currentPage / readingStatus.pageCount) * 100;
    }
    return 0;
  }

  ngOnInit() {

    this.http.get(this.libraryService.backend + '/api/comic/' + this.route.snapshot.paramMap.get('id')).subscribe(res => {
      this.comic = new Comic(res as Comic);
    });
  }

}
