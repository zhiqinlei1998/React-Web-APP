import React, {useState, useEffect} from 'react';
import config from './config';
const firebase = require('firebase');
const d3 = require("d3");

function Graphs() {    
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [movies, setMovies] = useState({});
    const [shouldRender, setShowRender] = useState(true);


    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        let ref = firebase.database().ref('movies'); 

        ref.once('value', (snapshot) => {
			const val = snapshot.val();
			console.log(val);
            setMovies(val);
            const keys = Object.keys(val);
            var n = [];
            var l = [];
            for(var i = 0; i < keys.length; i++) {
                n.push({
                    group: "movie",
                    id: keys[i],
                    poster: val[keys[i]].poster
                });
                const actors = val[keys[i]].Actors.split(", ");
                for(var j = 0; j < actors.length; j++) {
                    if(!n.some(elem => elem.id === actors[j])) {
                        n.push({
                            group: "actor",
                            id: actors[j]
                        });
                    }
                    l.push({
                        source: keys[i],
                        target: actors[j]
                    })
                }
            }
            setNodes(n);
            setLinks(l);

            const elem = document.getElementById("mysvg");

            elem.appendChild(graph(n, l));
        })

        

    }, [shouldRender])

    const drag = (sim, label) => {
        const dragStarted = (d) => {
            if(!d3.event.active) {
                sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;                
            }
        }

        const dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            label.attr("x", d.x)
                .attr("y", d.y - 40);
        }

        const dragEnded = (d) => {
            if(!d3.event.active) {
                sim.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;

        }

        return d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);
    }

    const graph = (n, l) => {
        const width = 1920;
        const height = 1080;

        const obj_nodes = n.map(d => Object.create(d));
        const obj_links = l.map(d => Object.create(d));

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        var defs = svg.append("svg:defs");

        n.forEach((d, i) => {
            if(d.group === "movie") {
                defs.append("svg:pattern")
                    .attr("id", "poster_" + d.id)
                    .attr("width", 1) 
                    .attr("height", 1)
                    .attr("patternUnits", "objectBoundingBox")
                    .append("svg:image")
                    .attr("xlink:href", d.poster)
                    .attr("width", 300)
                    .attr("height", 300)
                    .attr("x", -50)
                    .attr("y", -50);
            }
        })

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(obj_links)
            .join("line")
            .attr("stroke-width", 1.5);

        const radius = (node) => {
            if(node.group === "movie") {
                return 80;
            }
            else if(node.group === "actor") {
                return 20;
            }
        }

        const color = (node) => {
            if(node.group === "movie") {
                return "url(#poster_" + node.id + ")";
            }
            else if(node.group === "actor") {
                return "white";
            }
        }

        const simulation = d3.forceSimulation(obj_nodes)
            .force("link", d3.forceLink().links(l).id(d => { return d.id; }).distance(300))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        const label = svg.append("text")
            .attr("id", "label")
            .attr("font-size", 30)
            .attr("opacity", 0)
            .style("text-anchor", "middle")
            .text("");

        const node = svg.append("g")
            .selectAll("circle")
            .data(obj_nodes)
            .join("circle")
            .attr("r", radius)
            .style("fill", color)
            .call(drag(simulation, label));


        node.on("mouseover", (d) => {
            if(d.group === "actor") {
                var c = d3.select(this);
                label
                    .raise()
                    .attr("opacity", 1)
                    .text(d.id)
                    .attr("x", d.x)
                    .attr("y", d.y - 40);
            }
        })
        .on("mouseout", (d) => {
            if(d.group === "actor") {
                label
                    .attr("opacity", 0)
                    .text(d.id);
            }
        });

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        })
        
        return svg.node();
    }

    return (
        <div id="mysvg">
        </div>
    );
}

export default Graphs;