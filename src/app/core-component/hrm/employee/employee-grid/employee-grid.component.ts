import { Component } from '@angular/core';
import { SidebarService, routes } from 'src/app/core/core.index';

interface data {
  value: string;
}
@Component({
    selector: 'app-employee-grid',
    templateUrl: './employee-grid.component.html',
    styleUrl: './employee-grid.component.scss',
    standalone: false
})
export class EmployeeGridComponent {
  public routes = routes;
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';

  selectedList1: data[] = [
    { value: 'Choose Name' },
    { value: 'Mitchum Daniel' },
    { value: 'Susan Lopez' },
    { value: 'Robert Grossman' },
    { value: 'Janet Hembre' },
  ];
  selectedList2: data[] = [
    { value: 'Choose Status' },
    { value: 'Active' },
    { value: 'Inactive' },
  ];
  selectedList3: data[] = [
    { value: 'Sort by Date' },
    { value: 'Newest' },
    { value: 'Oldest' },
  ];


  constructor(private sidebar: SidebarService) {}

  isCollapsed: boolean = false;
  toggleCollapse() {
    this.sidebar.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  public filter = false;
  openFilter() {
    this.filter = !this.filter;
  }
}
