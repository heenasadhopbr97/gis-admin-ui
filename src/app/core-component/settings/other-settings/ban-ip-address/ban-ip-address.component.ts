import { Component } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { SidebarService } from 'src/app/core/service/sidebar/sidebar.service';

interface data {
  value: string;
}

@Component({
    selector: 'app-ban-ip-address',
    templateUrl: './ban-ip-address.component.html',
    styleUrl: './ban-ip-address.component.scss',
    standalone: false
})
export class BanIpAddressComponent {
  editor!: Editor;
  editor1!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
    ['link'],
  ];
 public selectedValue1 = '';
 public selectedValue2 = '';
 selectedList1: data[] = [
  { value: 'Sort by Datee' },
  { value: 'Newest' },
  { value: 'Oldest' },
];
selectedList2: data[] = [
  { value: 'Choose IP' },
  { value: '211.11.0.25' },
  { value: '211.03.0.11' },
];
constructor( private sidebar: SidebarService){
    
}
  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
public filter = false;
openFilter() {
  this.filter = !this.filter;
}

ngOnInit(): void {
  this.editor = new Editor();
  this.editor1 = new Editor();
}
ngOnDestroy(): void {
  this.editor.destroy();
  this.editor1.destroy();
}
}
