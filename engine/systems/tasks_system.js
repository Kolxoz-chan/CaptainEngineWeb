class TasksSystem
{
  static tasks = [];

  static init()
  {
    
  }

  static update()
  {
    if(this.tasks.length > 0)
    {
      for(let i in this.tasks)
      {
        this.tasks[i]();
      }
      this.tasks = []
    }
  }

  static addTask(func)
	{
		this.tasks.push(func)
	}
}
