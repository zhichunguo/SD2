var childrenArray = new Array();
var select_Array = new Array();
var end_info = new Object();
var originx, originy;
var midline = 305;
var up;
var nodes;

var drag = d3.behavior.drag()
    .origin(function(d) { 
            return d;
    })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function getChildren(array, node){
    if (node) {
        node.forEach(function (d){
            array.push(d);
            getChildren(array, d.children);
        })
    }
    return array;
}

function color_children(node){
    if(node){
        node.forEach(function(d){
            d.color = 1;
            color_children(d.children);
        })
    }
}

function dragstarted(d){
    childrenArray = [];
    select_Array = getChildren(childrenArray, [d]);
    originx = d.x;
    originy = d.y;

    if(d.y < midline){
        up = 1;
    }
    else{
        up = 0;
    }

    if((updraw == 1 && downdraw == 0) || (updraw == 1 && downdraw == 1 && up == 1)){
        nodes = upnodes;
    }
    else if((updraw == 0 && downdraw == 1) || (updraw == 1 && downdraw == 1 && up == 0)){
        nodes = downnodes;
    }

    if(d.depth != 1){
        if(d.last == undefined){
            var parent = d.parent;
            var start = -1, end = nodes.length;
            for(var i = 0; i < parent.children.length; i++){
                nodes[parent.children[i].num].last = start;
                start = parent.children[i].num;
                if(i == parent.children.length - 1){
                    nodes[parent.children[i].num].next = end;
                }            
                else{
                    nodes[parent.children[i].num].next = parent.children[i+1].num;
                }
            }
        }
    }

    // if((updraw == 1 && downdraw == 1 && up == 1) || (updraw == 1 && downdraw == 0)){
    //     d3.select("#up_sunburst").selectAll(".node")
    //             .filter(function(node){
    //                 return node.color == 1;
    //             })
    //             .style("stroke",function(node){
    //                 node.color = 0;
    //                 return "white";
    //             });
    // }
    // else if((updraw == 1 && downdraw == 1 && up == 0) || (updraw == 0 && downdraw == 1)){
    //     d3.select("#down_sunburst").selectAll(".node")
    //             .filter(function(node){
    //                 return node.color == 1;
    //             })
    //             .style("stroke",function(node){
    //                 node.color = 0;
    //                 return "white";
    //             });
    // }

    color_children([d]);

    if((updraw == 1 && downdraw == 1 && up == 1) || (updraw == 1 && downdraw == 0)){
        d3.select("#up_sunburst").selectAll(".node")
                .filter(function(node){
                    return node.color == 1;
                })
                .style("stroke",function(node){
                    return "orange";
                });
    }
    else if((updraw == 1 && downdraw == 1 && up == 0) || (updraw == 0 && downdraw == 1)){
        d3.select("#down_sunburst").selectAll(".node")
                .filter(function(node){
                    return node.color == 1;
                })
                .style("stroke",function(node){
                    return "orange";
                });
    }
}

function dragged(d){
    if((updraw == 1 && downdraw == 1) || (updraw == 0 && downdraw == 1 && d.depth != 1) || (updraw == 1 && downdraw == 0 && d.depth != 1)){
        select_Array.forEach(function(element) {
            element.x += d3.event.dx;
        });
        if(d.next < nodes.length){
            if((d.x + d.dx) >= (nodes[d.next].x + nodes[d.next].dx)){
                var temp_x = originx + nodes[d.next].dx;
                var next = d.next;
                if(d.last >= 0){
                    nodes[d.last].next = d.next;
                }
                if(nodes[nodes[d.next].next] != undefined){
                    nodes[nodes[d.next].next].last = d.num;
                }
                d.next = nodes[next].next;
                nodes[next].next = d.num;
                nodes[next].last = d.last;
                d.last = next;
                childrenArray = [];
                var changeArray = getChildren(childrenArray, [nodes[next]]);
                var distance = nodes[next].x - originx;
                changeArray.forEach(function(element){
                    element.x -= distance;
                })
                originx = temp_x;
                //console.log(originx)
                
            }
        }
        if(d.last >= 0){
            if(d.x <= nodes[d.last].x){
                var temp_x = originx - nodes[d.last].dx;
                var last = d.last;
                if(d.next < nodes.length){
                    nodes[d.next].last = d.last;
                }
                if(nodes[nodes[d.last].last] != undefined){
                    nodes[nodes[d.last].last].next = d.num;
                }
                d.last = nodes[d.last].last;
                nodes[last].next = d.next;
                nodes[last].last = d.num;
                d.next = last;
                childrenArray = [];
                var changeArray = getChildren(childrenArray, [nodes[last]]);
                var distance = d.dx;
                changeArray.forEach(function(element){
                    element.x += distance;
                })
                originx = temp_x;
                //console.log(originx)
            }
        }
        if((updraw == 1 && downdraw == 1 && up == 1) || (updraw == 1 && downdraw == 0)){
            d3.select("#up_sunburst").selectAll(".node")
                    .attr("x",function(node){
                        return node.x
                    });
    
            d3.select("#up_sunburst").selectAll(".label")
                        .attr("transform", function(d) { return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")rotate(90)"; })
    
        }
        else if((updraw == 1 && downdraw == 1 && up == 0) || (updraw == 0 && downdraw == 1)){
            d3.select("#down_sunburst").selectAll(".node")
                    .attr("x",function(node){
                        return node.x
                    });
    
            d3.select("#down_sunburst").selectAll(".label")
                        .attr("transform", function(d) { return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")rotate(90)"; })
    
        }
    }
    else if((updraw == 0 && downdraw == 1 && d.depth == 1) || (updraw == 1 && downdraw == 0 && d.depth == 1)){
        if((d.up==0 && d.y <= midline)||(d.up==1 && d.y+d.dy<midline)){
            if(d.up == 0 && d.y<=midline){
                d.up = 1;
                if(d.last >= 0){
                    nodes[d.last].next = d.next;
                    if(d.next < nodes.length){
                        nodes[d.next].last = d.last;
                        var node = nodes[d.last];
                        while(node.next < nodes.length){
                            childrenArray = [];
                            var changeArray = getChildren(childrenArray, [nodes[node.next]]);
                            var distance = d.dx;
                            changeArray.forEach(function(element){
                                element.x -= distance;
                            })
                            node = nodes[node.next];
                        }
                    }
                    else{
                        end_info['down'] = d.last;
                    }
                }
                else{
                    if(d.next < nodes.length){
                        nodes[d.next].last = -1;
                        var node = d;
                        while(node.next < nodes.length){
                            childrenArray = [];
                            var changeArray = getChildren(childrenArray, [nodes[node.next]]);
                            var distance = d.dx;
                            changeArray.forEach(function(element){
                                element.x -= distance;
                            })
                            node = nodes[node.next];
                        }
                    }
                    else{
                        end_info['down'] = -1;
                    }
                }
    
                select_Array.forEach(function(element){
                    element.x += d3.event.dx;
                    element.y = 305 - 30 * element.depth + d3.event.dy;
                    if(nodes[nodes.length -1].depth != 1){
                        if(element.depth == nodes[nodes.length -1].depth){
                            element.y = element.y + 30 - element.dy;
                        }
                    }
                    // if(element.depth == 1){
                    //     element.x += d3.event.dx;
                    //     element.y = 275 + d3.event.dy;
                    // }
                    // else if(element.depth == 2){
                    //     element.x += d3.event.dx;
                    //     element.y = 245 + d3.event.dy;
                    // }
                    // else if(element.depth == 3){
                    //     element.x += d3.event.dx;
                    //     element.y =  245 - element.dy + d3.event.dy;
                    // }
                })
                if(end_info['up'] == -1){
                    originx = 0;
                    originy = 300 - d.dy;
                    end_info['up'] = d.num;
                    d.next = nodes.length;
                    d.last = -1;
                }
                else{
                    d.last = end_info['up'];
                    d.next = nodes.length;
                    nodes[end_info['up']].next = d.num;
                    originx = nodes[end_info['up']].x + nodes[end_info['up']].dx;
                    originy = 300 - d.dy;
                    end_info['up'] = d.num;
                }
            }
    
            select_Array.forEach(function(element) {
                element.x += d3.event.dx;
                element.y += d3.event.dy;
            });
            if(d.next < nodes.length){
                if((d.x + d.dx) >= (nodes[d.next].x + nodes[d.next].dx)){
                    var temp_x = originx + nodes[d.next].dx;
                    var next = d.next;
                    if(d.last >= 0){
                        nodes[d.last].next = d.next;
                    }
                    if(nodes[nodes[d.next].next] != undefined){
                        nodes[nodes[d.next].next].last = d.num;
                    }
                    else{
                        end_info['up'] = d.num;
                    }
                    d.next = nodes[next].next;
                    nodes[next].next = d.num;
                    nodes[next].last = d.last;
                    d.last = next;
                    childrenArray = [];
                    var changeArray = getChildren(childrenArray, [nodes[next]]);
                    var distance = nodes[next].x - originx;
                    changeArray.forEach(function(element){
                        element.x -= distance;
                    })
                    originx = temp_x;
                    //console.log(originx)
                }
            }
            if(d.last >= 0){
                if(d.x <= nodes[d.last].x){
                    var temp_x = originx - nodes[d.last].dx;
                    var last = d.last;
                    if(d.next < nodes.length){
                        nodes[d.next].last = d.last;
                    }
                    else{
                        end_info['up'] = last;
                    }
                    if(nodes[nodes[d.last].last] != undefined){
                        nodes[nodes[d.last].last].next = d.num;
                    }
                    d.last = nodes[d.last].last;
                    nodes[last].next = d.next;
                    nodes[last].last = d.num;
                    d.next = last;
                    childrenArray = [];
                    var changeArray = getChildren(childrenArray, [nodes[last]]);
                    var distance = d.dx;
                    changeArray.forEach(function(element){
                        element.x += distance;
                    })
                    originx = temp_x;
                    //console.log(originx)
                }
            }
        }
        else{
            if(d.up == 1 && d.y+d.dy>midline){
                d.up = 0;
                if(d.last >= 0){
                    nodes[d.last].next = d.next;
                    if(d.next < nodes.length){
                        nodes[d.next].last = d.last;
                        var node = nodes[d.last];
                        while(node.next < nodes.length){
                            childrenArray = [];
                            var changeArray = getChildren(childrenArray, [nodes[node.next]]);
                            var distance = d.dx;
                            changeArray.forEach(function(element){
                                element.x -= distance;
                            })
                            node = nodes[node.next];
                        }
                    }
                    else{
                        end_info['up'] = d.last;
                    }
                }
                else{
                    if(d.next < nodes.length){
                        nodes[d.next].last = -1;
                        var node = d;
                        while(node.next < nodes.length){
                            childrenArray = [];
                            var changeArray = getChildren(childrenArray, [nodes[node.next]]);
                            var distance = d.dx;
                            changeArray.forEach(function(element){
                                element.x -= distance;
                            })
                            node = nodes[node.next];
                        }
                    }
                    else{
                        end_info['up'] = -1;
                    }
                }
    
                select_Array.forEach(function(element){
                    element.x += d3.event.dx;
                    element.y = 315 + 30 * (element.depth -1) + d3.event.dy;
                    // if(element.depth == 1){
                    //     element.x += d3.event.dx;
                    //     element.y = 315 + d3.event.dy;
                    // }
                    // else if(element.depth == 2){
                    //     element.x += d3.event.dx;
                    //     element.y = 345 + d3.event.dy;
                    // }
                    // else if(element.depth == 3){
                    //     element.x += d3.event.dx;
                    //     element.y = 375 + d3.event.dy;
                    // }
                })
                if(end_info['down'] == -1){
                    originx = 0;
                    originy = 310;
                    end_info['down'] = d.num;
                    d.next = nodes.length;
                    d.last = -1;
                }
                else{
                    d.last = end_info['down'];
                    d.next = nodes.length;
                    nodes[end_info['down']].next = d.num;
                    originx = nodes[end_info['down']].x + nodes[end_info['down']].dx;
                    originy = 310;
                    end_info['down'] = d.num;
                }
            }
            
            select_Array.forEach(function(element) {
                element.x += d3.event.dx;
                element.y += d3.event.dy;
            });
            if(d.next < nodes.length){
                if((d.x + d.dx)>= (nodes[d.next].x + nodes[d.next].dx)){
                    var temp_x = originx + nodes[d.next].dx;
                    var next = d.next;
                    if(d.last >= 0){
                        nodes[d.last].next = d.next;
                    }
                    if(nodes[nodes[d.next].next] != undefined){
                        nodes[nodes[d.next].next].last = d.num;
                    }
                    else{
                        end_info['down'] = d.num;
                    }
                    d.next = nodes[next].next;
                    nodes[next].next = d.num;
                    nodes[next].last = d.last;
                    d.last = next;
                    childrenArray = [];
                    var changeArray = getChildren(childrenArray, [nodes[next]]);
                    var distance = nodes[next].x - originx;
                    changeArray.forEach(function(element){
                        element.x -= distance;
                    })
                    originx = temp_x;
                    //console.log(originx)
                }
            }
            if(d.last >= 0){
                if(d.x <= nodes[d.last].x){
                    var temp_x = originx - nodes[d.last].dx;
                    var last = d.last;
                    if(d.next < nodes.length){
                        nodes[d.next].last = d.last;
                    }
                    else{
                        end_info['down'] = last;
                    }
                    if(nodes[nodes[d.last].last] != undefined){
                        nodes[nodes[d.last].last].next = d.num;
                    }
                    d.last = nodes[d.last].last;
                    nodes[last].next = d.next;
                    nodes[last].last = d.num;
                    d.next = last;
                    childrenArray = [];
                    var changeArray = getChildren(childrenArray, [nodes[last]]);
                    var distance = d.dx;
                    changeArray.forEach(function(element){
                        element.x += distance;
                    })
                    originx = temp_x;
                    //console.log(originx)
                }
            }
             
        }
        if(updraw == 1){
            d3.select("#up_sunburst").selectAll(".node")
                    .attr("x",function(node){
                        return node.x
                    })
                    .attr("y",function(node){
                        return node.y
                    });
    
            d3.select("#up_sunburst").selectAll(".label")
                            .attr("transform", function(d) { 
                                if(typeof(d.size) == "undefined"){
                                    if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth])){
                                        return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                                    }
                                    return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)";
                                }
                                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy-5) + ")rotate(90)";  })    
        }
        else if(downdraw == 1){
            d3.select("#down_sunburst").selectAll(".node")
                    .attr("x",function(node){
                        return node.x
                    })
                    .attr("y",function(node){
                        return node.y
                    });
    
            d3.select("#down_sunburst").selectAll(".label")
                            .attr("transform", function(d) { 
                                if(typeof(d.size) == "undefined"){
                                    return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)"
                                }
                                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + 5) + ")rotate(90)";  })    
        }
    }
}

function dragended(d){
    var x_distance = d.x - originx;
    var y_distance = d.y - originy;
    select_Array.forEach(function(element){
        element.x -= x_distance;
        element.y -= y_distance;
    })
    if((updraw == 1 && downdraw == 0) || (updraw == 1 && downdraw == 1 && up == 1)){
        d3.select("#up_sunburst").selectAll(".node")
                .attr("x",function(node){
                    return node.x
                })
                .attr("y",function(node){
                    return node.y
                })
                .style("stroke", function(node){
                    node.color = 0;
                    return "white";
                });
                
        d3.select("#up_sunburst").selectAll(".label")
                    .attr("transform", function(d) { 
                        if(typeof(d.size) == "undefined"){
                            if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth])){
                                return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                            }
                            return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)";
                        }
                        else{
                            return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy-5) + ")rotate(90)"; 
                        }
                    });

    }
    else if((updraw == 0 && downdraw == 1) || (updraw == 1 && downdraw == 1 && up == 0)){
        d3.select("#down_sunburst").selectAll(".node")
                .attr("x",function(node){
                    return node.x
                })
                .attr("y",function(node){
                    return node.y
                })
                .style("stroke", function(node){
                    node.color = 0;
                    return "white";
                });

        d3.select("#down_sunburst").selectAll(".label")
                    .attr("transform", function(d) { 
                        if(typeof(d.size) == "undefined"){
                            if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                                return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                            }
                            return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)";
                        }
                        else{
                            return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + 5) + ")rotate(90)"; 
                        }
                    });

    }
}