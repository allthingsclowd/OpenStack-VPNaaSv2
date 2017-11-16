import { CloudvisualisedService } from './services/cloudvisualised.service';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Scale from 'd3-scale';
import * as d3Drag from 'd3-drag';
import * as d3Color from 'd3-color';

@Component({
  selector: 'app-cloudvisualised',
  templateUrl: './cloudvisualised.component.html',
  styleUrls: ['./cloudvisualised.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CloudvisualisedComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy  {
  // @ViewChild('chart') private chartContainer: ElementRef;
  svg: any;
  link: any;
  node: any;
  color: any;
  simulation: any;
  nodeDetails: any;
  chartTester: any;
  height: any;
  width: any;
  radius: any;

   constructor( private cloudvisualisedService: CloudvisualisedService ) {
                  this.cloudvisualisedService.currentVisualData.subscribe(newData => this.nodeDetails = newData);
                }

  ngOnInit() {

  }

  ngAfterViewInit() {
    //console.log('START OF CREATECHART IN CHART');
    this.svg = d3Selection.select('svg');
      
    this.width = +this.svg.attr('width');
    this.height = +this.svg.attr('height');
    this.radius = 5;
    console.log('Height & Width');
    console.log(this.height);
    console.log(this.width);

    // Original data
    const dataset = this.nodeDetails;

    // Initialize a simple force layout, using the nodes and edges in dataset
    this.color = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);

    const networkCenter = d3Force.forceCenter().x(250).y(250);

    const modulePosition = {
      "2": {x: 0, y: 0},
      "3": {x: 250, y: 25},
      "1": {x: 0, y: 250}
    };

    //Make the x-position equal to the x-position specified in the module positioning object or, if not in
    //the hash, then set it to 250
    let forceX = d3Force.forceX(function (d) {return modulePosition[d.module] ? modulePosition[d.module].x : 250})
    .strength(0.05);

    //Same for forceY--these act as a gravity parameter so the different strength determines how closely
    //the individual nodes are pulled to the center of their module position
    let forceY = d3Force.forceY(function (d) {return modulePosition[d.module] ? modulePosition[d.module].y : 250})
    .strength(0.05);


    this.simulation = d3Force.forceSimulation()
        .force('link', d3Force.forceLink().id(function(d) { return d.index; }))
        .force('charge', d3Force.forceManyBody().strength(-150).distanceMax(100))
        .force('center', networkCenter)
        .force("x", forceX)
        .force("y", forceY);

    // this.render(this.testdata);
    //console.log('Bananas');
    //console.log(this.testdata);
    //console.log(this.cloudvisualisedService.convertToD3(this.nodeDetails));
    this.render(this.nodeDetails);
  }

  ticked() {
    
    this.link
    .attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });
    //console.log(this.link);

    this.node
      .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});
    //console.log(this.node);

  }

  ngOnDestroy() {
  }

  ngOnChanges() {

  }

  render(graph) {
    console.log('HELEN');
    console.log(graph.nodes);
    console.log(graph.links);

    this.link = this.svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line')
      .attr('stroke-width', function(d) { return Math.sqrt(d.weight); });

    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .text(function(d) {
        console.log(d.type);
        switch(d.type) {
          case 'network': {
             return '\uf0c2';
          }
          case 'port: network': {
            return '\uf0a9';
         }
          case 'subnetwork': {
            return '\uf18e';
          }
          case 'router': {
            return '\uf25d';
          }
          case 'port: compute': {
            return '\uf108';
          }
          case 'port: dhcp': {
            return '\uf0cb';
          }
          case 'lbaas': {
            return '\uf24e';
          }
          default: {
             return '\uf188';
          }
       }
        })
      .attr("x", -8)
      .attr("y", 0)
      .attr("width", 16)
      .attr("height", 16)
      .attr('font-family', 'FontAwesome')
      .attr('font-size', function(d) { return d.weight+'em'} )
      .style("fill", (d)=> this.color(d.type))
        .call(d3Drag.drag()
            .on("start", (d)=>{return this.dragstarted(d)})
            .on("drag", (d)=>{return this.dragged(d)})
            .on("end", (d)=>{return this.dragended(d)}));

    this.node.append("title")
      .text(function (d) {return d.name});


    // this.node.append("title")
    //   .style("text-anchor", "middle")
    //   .attr("y", 3)
    //   .style("font-size", "8px")
    //   .text(function (d) {return d.name})
    //   .style("pointer-events", "none");

    // this.node.append("title")
    // .attr("dx", 12)
    // .attr("dy", ".35em")
    // .text(function(d) { return d.name });

    this.simulation
      .nodes(graph.nodes)
      .on('tick', ()=>{return this.ticked()});

    this.simulation.force('link')
      .links(graph.links);
  }

  dragged(d) {
    d.fx = d3Selection.event.x;
    d.fy = d3Selection.event.y;
  }

  dragended(d) {
    if (!d3Selection.event.active) { this.simulation.alphaTarget(0); }
    d.fx = null;
    d.fy = null;
  }

  dragstarted(d) {
    if (!d3Selection.event.active) { this.simulation.alphaTarget(0.3).restart(); }
    d.fx = d.x;
    d.fy = d.y;
  }

}

