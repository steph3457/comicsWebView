import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: [ './library.component.scss' ]
})
export class LibraryComponent implements OnInit {

  displayedColumns: string[] = [ 'Image', 'Title', 'Year', 'Publisher', 'Issues' ];

  constructor (public libraryService: LibraryService) { }
  ngOnInit() {
  }
}
