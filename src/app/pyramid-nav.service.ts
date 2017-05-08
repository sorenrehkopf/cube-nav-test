import { Injectable } from '@angular/core';
import * as Three from 'three';
import {Routes} from './routes';

@Injectable()
export class PyramidNavService {

	containerEl;
	cube;
	timeout;
	lastX;
	lastY;
	font;
	light = new Three.DirectionalLight( 0xffffff, 2);
	scene = new Three.Scene();
	camera = new Three.PerspectiveCamera(45, 600/600);
	renderer = new Three.WebGLRenderer({alpha:true});
	routes = Routes;
	autoRotate = false;


	public init() {
		this.buildScene();
		this.attachListeners();
		this.render.bind(this)();
	}

	private render(){
		requestAnimationFrame(_ => this.render());
		if(this.autoRotate){
			this.cube.rotation.x += .003;
			this.cube.rotation.y += .002;
		}
		this.renderer.render(this.scene , this.camera);
	}

	private attachListeners(){
		this.renderer.domElement.addEventListener('mousedown',this.interactionStartHandler.bind(this));
		this.renderer.domElement.addEventListener('touchstart',this.interactionStartHandler.bind(this));
	}

	public toggle(){
		this.autoRotate = true;
		this.containerEl.classList.toggle('shrunk');
	}

	public interactionStartHandler(e){
		clearTimeout(this.timeout);
		this.autoRotate = false;
		this.renderer.domElement.onmouseup = this.toggle.bind(this);
		this.renderer.domElement.ontouchend = this.toggle.bind(this);
		document.onmousemove = this.spin.bind(this);
		document.ontouchmove = this.spin.bind(this);
		this.lastX = e.clientX ||e.touches[0].clientX;
		this.lastY = e.clientY || e.touches[0].clientY;
	}

	public spin(e){
		e.preventDefault();
		var newY = e.clientY || e.touches[0].clientY;
		var newX = e.clientX ||e.touches[0].clientX;
		document.onmouseup = this.spinEnd.bind(this);
		document.ontouchend = this.spinEnd.bind(this);
		this.renderer.domElement.onmouseup = this.spinEnd.bind(this);
		this.renderer.domElement.ontouchend = this.spinEnd.bind(this);
		var dY = newY - this.lastY;
		var dX = newX - this.lastX;
		console.log(dX,dY);
		this.cube.rotation.y += (dX * .003);
		this.cube.rotation.x += (dY * .003);
		this.lastX = newX;
		this.lastY = newY;
	}

	public spinEnd(){
		this.renderer.domElement.onmouseup = null;
		this.renderer.domElement.ontouchend = null;
		document.onmouseup = null;
		document.ontouchend = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		// this.timeout = setTimeout(function(){this.autoRotate = true;}.bind(this),2000);
	}

	private buildScene(){
		this.containerEl = document.getElementById('pyr-nav');
		this.renderer.setSize(600,600);
		this.renderer.setClearColor(0xFFFFFF,0);
		this.containerEl.appendChild(this.renderer.domElement);
		var material = new Three.MeshLambertMaterial( { color: 0x00ff00 } );
		var multiMaterial = [material];
		this.cube = Three.SceneUtils.createMultiMaterialObject(new Three.TetrahedronGeometry( 30 ),multiMaterial );
		// this.cube.rotation.set(-.5,-.5,0);
		this.scene.add( this.cube );
		this.light.position.set(4,0,30);
		this.scene.add( this.light );
		this.camera.position.set(0,0,100);
		var axisHelper = new Three.AxisHelper(100);
		this.scene.add(axisHelper);
		this.addNavItems();
	}

	private addNavItems(){
		var loader = new Three.FontLoader();
		loader.load( 'assets/fonts/Arial_Regular.json', function ( font ) {
			this.font = font;
			this.routes.forEach(function(route){
				var geometry = new Three.TextGeometry(route.name,{
					font:font,
					size:3,
					height:1
				});
				var material = new Three.MeshLambertMaterial({color:0x000000});
				var triangleGeometry = new Three.CircleGeometry(25,3);
				var triangleMaterial = new Three.MeshBasicMaterial({color:0x00ff00,opacity:0,transparent:true});
				var triangle = new Three.Mesh(triangleGeometry, triangleMaterial);
				var text = new Three.Mesh(geometry,material);
				triangle.add(text);
				text.rotation.set(0,0,.52)
				text.position.set(route.textPosition.x,route.textPosition.y,route.textPosition.z);
				triangle.position.set(route.position.x,route.position.y,route.position.z);
				triangle.rotation.set(route.rotation.x,route.rotation.y,route.rotation.z);
				this.cube.add( triangle );
			}.bind(this));
		}.bind(this));
		
	}

	public adjust(adjust,axis,dir){
		this.cube.children[this.cube.children.length-1][adjust][axis] += dir;
		console.log(axis,adjust)
		console.log(this.cube.children[this.cube.children.length-1][adjust][axis]);
	}

	constructor() { }

}
