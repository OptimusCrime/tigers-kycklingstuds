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
function nkGubbe(name)
{
   this.base = nkActor;
   this.base(0,90,name + "_obj","gubbar");
   delete this.base;
   this.dy = -5;
   this.state = "walk";
   this.GROUND_LEVEL = 320;
   this.GOAL_LEVEL = 195;
   this.GOAL_X = 580;
}
function nkPumpa()
{
   this.base = nkActor;
   this.base(-100,340,"pumpa_obj","pumpa");
   delete this.base;
   this.LEFT_LIMIT = 140;
   this.RIGHT_LIMIT = 500;
   this.initReleaseTimeTable(1);
   this.saveCount = 0;
   this.releasedCount = 0;
   this.nextLevelChange = 5;
   this.gameOver = false;
   _level0.pumpa = this;
   this.UpdateScore();
   this.headNameIndex = Math.round(Math.random() * 100);
   this.headNames = new Array();
   this.headNames.push("kyckling");
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
nkGubbe.prototype.__proto__ = nkActor.prototype;
nkGubbe.prototype.className = "nkGubbe";
_level0.nkGubbe = nkGubbe;
nkGubbe.prototype.onEnterFrame = function()
{
   if(_level0.pumpa.gameOver && this.state != "failed")
   {
      this.movieClip.subObj.stop();
      this.state = "gameOver";
   }
   switch(null)
   {
      case "gameOver":
         this.movieClip._alpha = this.movieClip._alpha - 10;
         if(this.movieClip._alpha <= 0)
         {
            this.kill();
         }
         break;
      case "walk":
         this.x = this.x + 2;
         if(this.x > 110)
         {
            this.movieClip.gotoAndStop("fall");
            this.state = "fall";
         }
         break;
      case "fall":
         this.x = this.x + 3;
         this.y = this.y + this.dy;
         this.dy = this.dy + 1;
         if(this.y >= this.GROUND_LEVEL && this.dy > 0)
         {
            if(_level0.pumpa.checkBounce(this))
            {
               this.y = this.GROUND_LEVEL;
               this.dy = - 22;
               _level0.sndStuds.start(0,0);
            }
            else
            {
               _level0.pumpa.gameOver = true;
               this.state = "failed";
            }
         }
         else if(this.x > this.GOAL_X && this.y >= this.GOAL_LEVEL && this.dy > 0)
         {
            this.movieClip.gotoAndStop("walk");
            this.state = "safe";
            this.y = this.GOAL_LEVEL;
            _level0.pumpa.gubbeSaved();
         }
         break;
      case "safe":
         this.x = this.x + 2;
         if(this.x > 680)
         {
            this.kill();
         }
         break;
      case "failed":
         this.x = this.x + 3;
         this.dy = this.dy + 1;
         this.y = this.y + this.dy;
         if(this.y > 800)
         {
            this.kill();
            _level0.pumpa.gubbeKilled(this);
         }
   }
   this.UpdateMovieClip();
};
nkPumpa.prototype.__proto__ = nkActor.prototype;
nkPumpa.prototype.className = "nkPumpa";
_level0.nkPumpa = nkPumpa;
nkPumpa.prototype.UpdateScore = function()
{
   scoreText = this.saveCount.toString();
};
nkPumpa.prototype.gubbeSaved = function()
{
   this.saveCount = this.saveCount + 1;
   this.UpdateScore();
   _level0.sndSaved.start(0,0);
   trace("gubbe saved:" + this.saveCount);
};
nkPumpa.prototype.gubbeKilled = function(obj)
{
   _level0.sndKill.start(0,0);
   var x = obj.x + this.killCount * 20 - 60;
   this.killCount = this.killCount + 1;
   new _level0.nkActor(x,400,"tombstone_obj","tombstone");
   if(this.killCount >= 3)
   {
      _level0.gameOver = true;
      _root.gotoAndPlay("gameover");
   }
   else
   {
      this.restartLevel();
   }
};
nkPumpa.prototype.restartLevel = function()
{
   trace("*restartLevel");
   this.gameOver = false;
   this.initReleaseTimeTable(Math.max(1,this.timeslots - 1),1);
   this.releasedCount = Math.round(Math.max(0,this.nextLevelChange - 5 * this.timeslots / 2));
   trace(" new releasedCount = " + this.releasedCount);
};
nkPumpa.prototype.initReleaseTimeTable = function(numSlots, pause)
{
   if(pause == null)
   {
      pause = 0;
   }
   this.timeslots = numSlots;
   this.releaseTime = new Array();
   var i = 0;
   while(i < this.timeslots)
   {
      this.releaseTime.push(45 * i / this.timeslots + 45 * (i * 9973 % this.timeslots) + 45 * pause);
      i++;
   }
   this.nextLevelChange = 5 * this.timeslots * (1 + this.timeslots) / 2;
   trace("level init " + this.timeslots + ", next level change = " + this.nextLevelChange);
};
nkPumpa.prototype.GetRandomDistance = function()
{
   return 3 + Math.floor(Math.random() * 1.333);
};
nkPumpa.prototype.SpawnControl = function()
{
   var i = 0;
   while(i < this.timeslots)
   {
      this.releaseTime[i]--;
      if(this.releaseTime[i] <= 0)
      {
         _level0.dynamicHeadName = this.headNames[this.headNameIndex % 5] + "_head_mc";
         this.headNameIndex = this.headNameIndex + 1;
         new _level0.nkGubbe(this.headNames[this.headNameIndex % this.headNames.length]);
         this.releaseTime[i] = this.releaseTime[i] + 45 * this.GetRandomDistance();
         this.releasedCount = this.releasedCount + 1;
         _level0.sndStart.start(0,0);
      }
      i++;
   }
};
nkPumpa.prototype.onEnterFrame = function()
{
   if(!this.gameOver)
   {
      if(this.releasedCount >= this.nextLevelChange)
      {
         this.initReleaseTimeTable(this.timeslots + 1,4);
      }
      this.SpawnControl();
   }
   this.x = Math.min(this.RIGHT_LIMIT,Math.max(this.LEFT_LIMIT,_level0._xmouse));
   this.UpdateMovieClip();
};
nkPumpa.prototype.checkBounce = function(obj)
{
   dx = Math.abs(obj.x - this.x);
   if(dx < this.movieClip._width / 2 + 10)
   {
      this.movieClip.gotoAndPlay("bounce");
      return true;
   }
   return false;
};
_level0.sndStuds = new Sound();
_level0.sndStuds.attachSound("studs.wav");
_level0.sndStart = new Sound();
_level0.sndStart.attachSound("start.wav");
_level0.sndKill = new Sound();
_level0.sndKill.attachSound("kill.wav");
_level0.sndGameover = new Sound();
_level0.sndGameover.attachSound("gameover.wav");
_level0.sndSaved = new Sound();
_level0.sndSaved.attachSound("saved.wav");
_level0.nk = new nkEngine();
var nk = _level0.nk;
nk.addActorLayer("pumpa",200,10);
nk.addActorLayer("tombstone",150,10);
nk.addActorLayer("gubbar",300,30);
new nkPumpa();
_root.onRollOut = function()
{
   trace("mouse left the building...");
};
_root.onRollOver = function()
{
   trace("mouse is back...");
};
stop();
