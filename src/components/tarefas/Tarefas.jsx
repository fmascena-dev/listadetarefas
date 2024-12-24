import './TarefasStyles.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Timer({ initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <span className="span-timer">
        {timeLeft > 0 ? formatTime(timeLeft) : 'Tarefa expirada'}
      </span>
      <div className="btns-timer">
        <button
          className="timer-go"
          onClick={handleStart}
          disabled={isRunning || timeLeft <= 0}
        >
          Iniciar
        </button>
        <button
          className="timer-stop"
          onClick={handleStop}
          disabled={!isRunning}
        >
          Parar
        </button>
      </div>
    </div>
  );
}

Timer.propTypes = {
  initialTime: PropTypes.number.isRequired,
};

export default function Tarefas() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [timer, setTimer] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (event) => {
    event.preventDefault();
    if (taskTitle.trim().length < 3) {
      alert('A sua tarefa precisa ter pelo menos 3 caracteres.');
      return;
    }

    const timeInSeconds = parseTime(timer);
    if (timeInSeconds <= 0) {
      alert('Insira um tempo válido no formato hh:mm:ss.');
      return;
    }

    setTasks([
      ...tasks,
      { title: taskTitle, done: false, timer: timeInSeconds },
    ]);
    setTaskTitle('');
    setTimer('');
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task,
    );
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const parseTime = (time) => {
    const [hrs, mins, secs] = time.split(':').map(Number);
    return (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
  };

  return (
    <main>
      <section>
        <h1>Lista de Tarefas</h1>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Adicione uma tarefa"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tempo (hh:mm:ss)"
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              style={{ textDecoration: task.done ? 'line-through' : 'none' }}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTaskCompletion(index)}
              />
              <span>{task.title}</span>
              <Timer initialTime={task.timer} />
              <button onClick={() => handleRemoveTask(index)}>
                ❎ Remover
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
