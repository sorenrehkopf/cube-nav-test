import { Injectable } from '@angular/core';
import * as Three from 'three';
import {Routes} from './routes';
import { Router,ActivatedRoute } from '@angular/router';

@Injectable()
export class PyramidNavService {

	containerEl;
	cube;
	timeout;
	lastX;
	lastY;
	font;
	shrunk;
	light = new Three.DirectionalLight( 0xffffff, 2);
	scene = new Three.Scene();
	camera = new Three.PerspectiveCamera(45, 600/600);
	renderer = new Three.WebGLRenderer({alpha:true});
	raycaster = new Three.Raycaster();
	routes = Routes;
	autoRotate = true;

	constructor(private router:Router,private activeRoute:ActivatedRoute) { }

	public init() {
		this.buildScene();
		this.attachListeners();
		this.render.bind(this)();
	}

	private render(){
		requestAnimationFrame(_ => this.render());
		if(this.autoRotate){
			// this.cube.rotation.x += .003;
			this.cube.rotation.y += .002;
		}
		this.renderer.render(this.scene , this.camera);
	}

	private attachListeners(){
		this.renderer.domElement.addEventListener('mousedown',this.interactionStartHandler.bind(this));
		this.renderer.domElement.addEventListener('touchstart',this.interactionStartHandler.bind(this));
	}

	public toggle(e){
		console.log(e)
		var elPos = this.containerEl.getBoundingClientRect();
		var y = e.clientY || e.touches[0].clientY;
		var x = e.clientX ||e.touches[0].clientX;
		x = ( (x-elPos.left) / this.renderer.domElement.width ) * 2 - 1;
		y = - ( (y-(elPos.top)) / this.renderer.domElement.height ) * 2 + 1;
		var vector = new Three.Vector2(x,y);
		document.onmousemove = null;
		document.ontouchmove = null;
		this.raycaster.setFromCamera(vector,this.camera);
		var objects = this.raycaster.intersectObjects(this.cube.children);
		if(objects[0]||this.shrunk){
			this.containerEl.parentElement.classList.toggle('shrunk');
			this.containerEl.classList.toggle('shrunk');
			this.autoRotate = true;
			if(objects[0]&&!this.shrunk) this.router.navigate([objects[0].object.userData.path]);
			else{
				setTimeout(function(){
					this.router.navigate(['/']);
				}.bind(this),1000);
				
			}
			this.shrunk = !this.shrunk;
		}
		this.timeout = setTimeout(function(){this.autoRotate = true;}.bind(this),2000);
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
		if(this.shrunk) return;
		var newY = e.clientY || e.touches[0].clientY;
		var newX = e.clientX ||e.touches[0].clientX;
		document.onmouseup = this.spinEnd.bind(this);
		document.ontouchend = this.spinEnd.bind(this);
		this.renderer.domElement.onmouseup = this.spinEnd.bind(this);
		this.renderer.domElement.ontouchend = this.spinEnd.bind(this);
		var dY = newY - this.lastY;
		var dX = newX - this.lastX;
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
		this.timeout = setTimeout(function(){this.autoRotate = true;}.bind(this),2000);
	}

	private buildScene(){
		this.containerEl = document.getElementById('pyr-nav');
		this.renderer.setSize(600,600);
		this.renderer.setClearColor(0xFFFFFF,0);
		this.containerEl.appendChild(this.renderer.domElement);
		var material = new Three.MeshLambertMaterial( { color: 0x00ff00 } );
		this.cube = new Three.Mesh(new Three.TetrahedronGeometry( 30 ),material );
		this.scene.add( this.cube );
		this.light.position.set(4,0,30);
		this.scene.add( this.light );
		this.camera.position.set(0,0,100);
		var axisHelper = new Three.AxisHelper(100);
		// this.scene.add(axisHelper);
		console.log(this.activeRoute);
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
				triangle.userData.path = route.path;
				text.rotation.set(0,0,.52);
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

}
