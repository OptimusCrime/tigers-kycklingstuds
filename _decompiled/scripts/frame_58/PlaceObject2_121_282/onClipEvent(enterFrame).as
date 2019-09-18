onClipEvent(enterFrame){
   if(_level0.mouseLost)
   {
      this._y = this._y + (200 - this._y) * 0.5;
      _level0.gamePaused = true;
   }
   else
   {
      this._y = this._y + (-200 - this._y) * 0.5;
      _level0.gamePaused = false;
   }
}
