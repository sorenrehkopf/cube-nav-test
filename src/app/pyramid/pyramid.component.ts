import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as Three from 'three';

import {Routes} from '../routes';

@Component({
  selector: 'nav-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss']
})
export class PyramidComponent implements OnInit {

	containerEl;
	cube;
	scene = new Three.Scene();
	camera = new Three.PerspectiveCamera(45, 600/600);
	renderer = new Three.WebGLRenderer({alpha:true});
	routes = Routes;

	constructor() { }

	ngOnInit() {
		this.containerEl = document.getElementById('pyr-nav');
		this.renderer.setSize(600,600);
		this.renderer.setClearColor(0xFFFFFF,0);
		this.containerEl.appendChild(this.renderer.domElement);
		var material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
		var multiMaterial = [material];
		this.cube = Three.SceneUtils.createMultiMaterialObject(new Three.CylinderGeometry( 0, 30, 40, 3, 3 ),multiMaterial );
		this.scene.add( this.cube );
		this.camera.position.set(0,0,100);
		console.log(Three);
		this.render.bind(this)();
	}

	render(){
		requestAnimationFrame(_ => this.render());
		this.cube.rotation.x += .02;
		this.cube.rotation.y += .01;
		this.renderer.render(this.scene , this.camera);
	}

}
