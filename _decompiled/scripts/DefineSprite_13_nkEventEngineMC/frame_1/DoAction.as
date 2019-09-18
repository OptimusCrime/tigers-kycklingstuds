nkEngine.prototype.className = "nkEngine";
nkEngine.prototype.setActorTimeline = function(actorTimeLine)
{
   this.actorTimeLine = actorTimeLine;
};
nkEngine.prototype.addActorLayer = function(layerName, startDepth, maxActors)
{
   var layer;
   layer = this.actorLayers[layerName];
   if(!_level0.assert(layer == null,this,"addActorLayer: actor layer \'" + layerName + "\' already exists."))
   {
      return null;
   }
   this.actorLayers[layerName] = new nkMovieClipLayer(this.actorTimeLine,startDepth,maxActors);
   layer = this.actorLayers[layerName];
   if(!_level0.assert(layer != null,this,"addActorLayer: could not create actor layer \'" + layerName + "\'."))
   {
      return null;
   }
};
nkEngine.prototype.addActor = function(actor)
{
   var layer = this.actorLayers[actor.layerName];
   if(!_level0.assert(layer != null,this,"addActor: could not add actor to layer \'" + actor.layerName + "\'. Layer does not exist."))
   {
      return false;
   }
   var mc = layer.createMovieClip(actor.movieClipId);
   if(!_level0.assert(mc != null,this,"addActor: could not add actor. createMovieClip returned null."))
   {
      return false;
   }
   mc.nkActor = actor;
   actor.movieClip = mc;
   this.actorList.push(actor);
};
nkEngine.prototype.removeActor = function(actor)
{
   var i;
   var list = this.actorList;
   i = 0;
   while(i < list.length)
   {
      if(list[i] == actor)
      {
         list.splice(i,1);
         var layerObj = actor.movieClip.nkMovieClipLayer;
         if(!_level0.assert(layerObj != null,this,"removeActor: could not remove actor movieclip. Layer object not defined."))
         {
            return false;
         }
         layerObj.destroyMovieClip(actor.movieClip);
         actor.movieClip = null;
         return true;
      }
      i++;
   }
   _level0.assert(false,this,"removeActor: could not find actor in actorList.");
   return false;
};
nkEngine.prototype.onKeyDown = function()
{
   var i;
   var actor;
   i = 0;
   while(i < this.actorList.length)
   {
      actor = this.actorList[i];
      actor.onKeyDown();
      i++;
   }
};
nkEngine.prototype.onEnterFrame = function()
{
   if(_level0.gamePaused)
   {
      return undefined;
   }
   var i;
   var actor;
   i = 0;
   while(i < this.actorList.length)
   {
      actor = this.actorList[i];
      actor.onEnterFrame();
      i++;
   }
   var killList = new Array();
   i = 0;
   while(i < this.actorList.length)
   {
      actor = this.actorList[i];
      if(actor.killed || this.killAllActors)
      {
         killList.push(actor);
      }
      i++;
   }
   i = 0;
   while(i < killList.length)
   {
      actor = killList[i];
      actor.destroy();
      i++;
   }
   this.killAllActors = false;
   this.frameCount = this.frameCount + 1;
};
nkMovieClipLayer.prototype.className = "nkMovieClipLayer";
nkMovieClipLayer.prototype.createMovieClip = function(clipId, initObj)
{
   if(!_level0.assert(this.depthList.length > 0,this,"createMovieClip: depth list is empty"))
   {
      return null;
   }
   var d = this.depthList.pop();
   var n = "mc" + d;
   this.timeLine.attachMovie(clipId,n,d,initObj);
   var mc = this.timeLine[n];
   if(!_level0.assert(mc != null,this,"createMovieClip: could not attach movieclip with id=" + clipId + " and name=" + n))
   {
      return null;
   }
   mc.nkDepth = d;
   mc.nkMovieClipLayer = this;
   return mc;
};
nkMovieClipLayer.prototype.destroyMovieClip = function(mc)
{
   if(!_level0.assert(mc.nkMovieClipLayer == this,this,"destroyMovieClip: movie clip not created by this layer object."))
   {
      return false;
   }
   var d = mc.nkDepth;
   if(!_level0.assert(d != null,this,"destroyMovieClip: movie clip does not have nkDepth property"))
   {
      return false;
   }
   mc.removeMovieClip();
   this.depthList.push(d);
   return true;
};
nkActor.prototype.className = "nkActor";
nkActor.prototype.destroy = function()
{
   this.engine.removeActor(this);
};
nkActor.prototype.kill = function()
{
   this.killed = true;
};
nkActor.prototype.UpdateMovieClip = function()
{
   this.movieClip._x = this.x;
   this.movieClip._y = this.y;
};
nkActor.prototype.onKeyDown = function()
{
};
nkActor.prototype.onEnterFrame = function()
{
   this.UpdateMovieClip();
};
function nkEngine()
{
   this.frameCount = 0;
   this.actorTimeLine = _root;
   this.actorList = new Array();
   this.actorLayers = new Object();
   this.killAllActors = false;
}
function nkMovieClipLayer(timeLine, startDepth, maxClips)
{
   this.timeLine = timeLine;
   this.depthList = new Array();
   var i;
   var d;
   d = startDepth + maxClips - 1;
   i = 0;
   while(i < maxClips)
   {
      this.depthList.push(d--);
      i++;
   }
   _level0.assert(this.depthList.length > 0,this,"constructor: depthList initialized with zero depth-values in constructor.");
}
function nkActor(x, y, movieClipId, layerName)
{
   this.engine = _level0.nk;
   this.killed = false;
   this.x = x;
   this.y = y;
   this.movieClipId = movieClipId;
   this.movieClip = null;
   this.layerName = layerName == null?"default":layerName;
   this.engine.addActor(this);
   this.UpdateMovieClip();
}
if(_level0.assert == null)
{
   _level0.assert = function(check, obj, message)
   {
      if(!check)
      {
         trace(">>> ASSERTION FAILED: (" + obj.className + ") " + message);
      }
      return check;
   };
}
if(_level0.nk == null)
{
   _level0.nk = new nkEngine();
}
if(_level0.nkEventEngineMC == null)
{
   _level0.attachMovie("nkEventEngineMC","nkEventEngineMC",6666);
   if(_level0.nkEventEngineMC == null)
   {
      trace(">>> nkEngine: Cannot attach nkEventEngineMC! Is it included in the library with correct linkage?");
   }
}
