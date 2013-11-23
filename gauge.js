/*!
 * Version: 1.0
 * Started: 30-05-2013
 * Updated: 30-05-2013
 * Url    : 
 * Author : paramana (hello AT paramana DOT com)
 *
 */

define("Gauge", [], function() {
    // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
    "use strict";
    
    function Gauge(element, options){
        if (!element)
            return;
        
        if (!options)
            options = {};
        
        this.element = element;
        this.$element = $(element);
        this.ctx = element.getContext("2d");

        this.width   = this.$element.width(),
        this.height  = this.$element.height();
        this.color   = options.color || "#31c995";
        this.bgcolor = options.bgcolor || "#f0f0f0";
        this.font    = options.font || "bold 16px arial"
        this.fontColor = options.fontColor || "#6d6d6d";
        this.degrees = 0;
        this.withAnim = options.anim != null ? options.anim : true;
        this.endDegrees = !options.end ? 0 : ((options.end / 100) * 361);

        this.draw();
    }
    
    Gauge.prototype.animateTo = function(){
        //clear animation loop if degrees reaches to endDegrees
        if (this.degrees == this.endDegrees)
            clearInterval(this.animationTimer);

        if (this.degrees < this.endDegrees)
            this.degrees++;
//        else
//            this.degrees--;
        
//        this.color = this.degrees >= 270 
//                            ? "#31c995" 
//                            : (this.degrees >= 170 
//                                    ? "#ffc35a" 
//                                    : "#ff4c4c");
        
        this.calculate();
    };
    
    Gauge.prototype.draw = function(){
        if (!this.withAnim) {
            this.degrees = this.endDegrees;
            this.calculate();
            return;
        }
        
        //Cancel any movement animation if a new chart is requested
        if (this.animationTimer)
            clearInterval(this.animationTimer);
        
        var _self      = this,
            difference = this.endDegrees - this.degrees;
    
        //This will animate the gauge to new positions
        //The animation will take 1 second
        //time for each frame is 1sec / difference in degrees
        this.animationTimer = setInterval(function(){
            _self.animateTo()
        }, 100 / difference);
    }
    
    Gauge.prototype.calculate = function(){
        var ctx    = this.ctx,
            width  = this.width,
            height = this.height,
            text, text_width, radians;

        //Clear the canvas everytime a chart is drawn
        ctx.clearRect(0, 0, width, height);

        //Background 360 degree arc
        ctx.beginPath();
        ctx.strokeStyle = this.bgcolor;
        ctx.lineWidth   = 10;
        ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2, false); //you can see the arc now
        ctx.stroke();

        //gauge will be a simple arc
        //Angle in radians = angle in degrees * PI / 180
        radians = this.degrees * Math.PI / 180;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
        //the arc will start from the topmost end
        ctx.arc(width / 2, height / 2, 60, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
        //you can see the arc now
        ctx.stroke();

        //Lets add the text
        ctx.fillStyle = this.fontColor;
        ctx.font = this.font;

        text = Math.floor(this.degrees / 360 * 100) + "%";
        //Lets center the text
        //deducting half of text width from position x
        text_width = ctx.measureText(text).width;
        //adding manual value to position y since the height of the text cannot
        //be measured easily. There are hacks but we will keep it manual for now.
        
        var textX = (width / 2 - text_width / 2) + 3,
            textY = height / 2 + 6;
    
        ctx.fillText(text, textX, textY);
    }
    
    Gauge.prototype.destroy = function(){
        clearInterval(this.animationTimer);
        this.$element.remove();
        delete this.ctx;
    };
    
    return Gauge;
});