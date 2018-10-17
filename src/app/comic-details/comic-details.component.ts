import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../library.service';
import { NotificationsService } from "angular2-notifications";
import { ActivatedRoute, Router } from '@angular/router';
import { Comic } from '../../lib/Comic';
import { Issue } from '../../lib/Issue';
import { HttpClient } from "@angular/common/http";


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
    public notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  toggleEditMode(edit: boolean) {
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
    let notif = this.notificationsService.info("Mark comic as read", "pending...");
    issue.readingStatus.read = !issue.readingStatus.read;
    this.http.post('/api/readingStatus', issue.readingStatus).subscribe(res => {
      this.notificationsService.remove(notif.id);
      this.notificationsService.success("Mark comic as read", "complete", { timeOut: 2000 });
    });
  }

  updateComicInfos() {
    let notif = this.notificationsService.info("Update comic infos", "pending...");
    this.http.get(this.libraryService.backend + '/api/comic/' + this.comic.id + '/updateInfos').subscribe(res => {
      this.comic = new Comic(res as Comic);
      this.notificationsService.remove(notif.id);
      this.notificationsService.success("Update comic infos", "complete", { timeOut: 2000 });
    });
  }
  updateComicVineId() {
    let notif = this.notificationsService.info("Update comic infos", "pending...");
    if (this.comic.comicVineId) {
      this.http.post(this.libraryService.backend + '/api/comic/' + this.comic.id + '/updateComicVineId', { comicVineId: this.comic.comicVineId }).subscribe(res => {
        this.comic = new Comic(res as Comic);
        this.notificationsService.remove(notif.id);
        this.notificationsService.success("Update comic infos", "complete", { timeOut: 2000 });
      });
    }
  }
  toggleFinished() {
    let notif = this.notificationsService.info("Update comic finished", "pending...");
    this.http.get(this.libraryService.backend + '/api/comic/' + this.comic.id + '/toggleFinished').subscribe(res => {
      this.comic.finished = !this.comic.finished;
      this.notificationsService.remove(notif.id);
      this.notificationsService.success("Update comic finished", "complete", { timeOut: 2000 });
    });
  }

  deleteIssue(issueId) {
    let notif = this.notificationsService.info("Delete issue", "pending...");
    this.http.delete(this.libraryService.backend + '/api/issue/' + issueId).subscribe(res => {
      this.notificationsService.remove(notif.id);
      for (let issueIndex in this.comic.issues) {
        if (this.comic.issues[issueIndex].id === issueId) {
          delete this.comic.issues[issueIndex];
        }
      }
      this.notificationsService.success("Delete issue", "complete", { timeOut: 1000 });
    });
  }

  updateIssueComic(
    comicId,
    issueId,
    notificationsService: NotificationsService
  ) {
    let notif = notificationsService.info(
      "Update issue comic",
      "pending..."
    );
    this.http
      .post(this.libraryService.backend + "/api/issue/" + issueId + "/updateComic", {
        comicId: comicId
      })
      .subscribe(res => {
        let requestResponse = res as RequestResponse;
        notificationsService.remove(notif.id);
        if (requestResponse.status === "success") {
          for (let issueIndex in this.comic.issues) {
            if (this.comic.issues[issueIndex].id === issueId) {
              delete this.comic.issues[issueIndex];
            }
          }
          notificationsService.success("Update issue comic", requestResponse.message, {
            timeOut: 2000
          });
        }
        else {
          notificationsService.error("Update issue comic", requestResponse.message, {
            timeOut: 2000
          });
        }
      });
  }
  updateIssueNumber(issueNumber, issueId, notificationsService: NotificationsService) {
    let notif = notificationsService.info(
      "Update issue number",
      "pending..."
    );
    this.http
      .post(this.libraryService.backend + "/api/issue/" + issueId + "/updateNumber", {
        issueNumber: issueNumber
      })
      .subscribe(res => {
        let requestResponse = res as RequestResponse;
        notificationsService.remove(notif.id);
        if (requestResponse.status === "success") {
          for (let issueIndex in this.comic.issues) {
            if (this.comic.issues[issueIndex].id === issueId) {
              this.comic.issues[issueIndex].number = issueNumber;
            }
          }
          notificationsService.success("Update issue number", requestResponse.message, {
            timeOut: 2000
          });
        }
        else {
          notificationsService.error("Update issue number", requestResponse.message, {
            timeOut: 2000
          });
        }
      });
  }

  ngOnInit() {

    this.http.get(this.libraryService.backend + '/api/comic/' + this.route.snapshot.paramMap.get('id')).subscribe(res => {
      this.comic = new Comic(res as Comic);
    });
  }

}
