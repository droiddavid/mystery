
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() leftSidebarOpen: boolean = true;
  @Input() rightSidebarOpen: boolean = true;

  @Output() toggleLeftSidebar = new EventEmitter<void>();
  @Output() toggleRightSidebar = new EventEmitter<void>();

  toggleLeft() {
    this.toggleLeftSidebar.emit();
  }

  toggleRight() {
    this.toggleRightSidebar.emit();
  }
}
