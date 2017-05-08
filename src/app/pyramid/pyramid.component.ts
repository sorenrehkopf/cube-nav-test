import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import {Routes} from '../routes';
import {PyramidNavService} from '../pyramid-nav.service';

@Component({
  selector: 'nav-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss'],
  providers:[PyramidNavService]
})
export class PyramidComponent implements OnInit {

	routes = Routes;

	constructor(private pyramid: PyramidNavService) { }

	ngOnInit() {
		this.pyramid.init();
	}

}
