import './TarefasStyles.scss';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Timer({ initialTime, onComplete, onTimeUpdate, isCompleted }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const updatedTime = prev - 1;
          onTimeUpdate(updatedTime);
          return updatedTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete, onTimeUpdate]);

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

  if (isCompleted) {
    return <span className="span-timer" style={{color: '#FFF'}}>Tarefa concluída!</span>;
  }

  return (
    <div className="timer">
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
  onComplete: PropTypes.func.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  isCompleted: PropTypes.func.isRequired,
};

export default function Tarefas() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [timer, setTimer] = useState('');
  const timerInputRef = useRef(null);

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
      { title: taskTitle, done: false, timer: timeInSeconds, completed: false },
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

  const markTaskAsCompleted = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: true, completed: true } : task,
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

  const handleTimerInput = (e) => {
    const input = e.target;
    const rawInput = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const cursorPosition = input.selectionStart; // Obtém a posição atual do cursor

    if (rawInput.length === 0) {
      setTimer('');
      return;
    }

    const formattedTimer = formatTimerInput(rawInput);

    // Reposiciona o cursor corretamente
    const newCursorPosition = adjustCursorPosition(
      cursorPosition,
      rawInput,
      formattedTimer,
    );

    setTimer(formattedTimer);

    // Reposiciona o cursor após atualizar o valor
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const adjustCursorPosition = (currentPos, rawInput, newValue) => {
    const diff = newValue.length - rawInput.length;
    let newPos = currentPos;

    // Se o número foi inserido, mova o cursor para a frente
    if (diff === 1) {
      if (currentPos === 2 || currentPos === 5) {
        // O cursor deve avançar após digitar um número, especialmente após um ":"
        newPos++;
      } else {
        newPos++;
      }
    }

    // Ajuste ao apagar
    if (diff === -1) {
      if (currentPos === 3 || currentPos === 6) {
        // Ao apagar, mova o cursor para trás (quando apagar os ":")
        newPos--;
      }
    }

    // Garantir que o cursor avance depois de digitar em qualquer lugar
    if (currentPos === newPos) {
      newPos++;
    }

    return newPos;
  };

  const formatTimerInput = (value) => {
    const cleanValue = value.slice(0, 6); // Limita a 6 caracteres
    const parts = cleanValue.match(/(\d{0,2})(\d{0,2})(\d{0,2})/);

    const hours = parts[1] || ''; // Preenche conforme necessário
    const minutes = parts[2] || '';
    const seconds = parts[3] || '';

    let formattedTime = hours;
    if (minutes.length > 0) formattedTime += `:${minutes}`;
    if (seconds.length > 0) formattedTime += `:${seconds}`;

    return formattedTime;
  };

  return (
    <main>
      <section>
        <h1>Lista de Tarefas</h1>
        <form onSubmit={handleAddTask}>
          <div className="inputs">
            <div className="input-task">
              <label htmlFor="task">Tarefa:</label>
              <input
                type="text"
                placeholder="Adicione uma tarefa"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="input-timer">
              <label htmlFor="timer">Duração:</label>
              <input
                ref={timerInputRef}
                type="text"
                placeholder="Tempo (hh:mm:ss)"
                value={timer}
                onChange={handleTimerInput}
              />
            </div>
          </div>
          <button className="add-task" type="submit">
            ➕ Adicionar
          </button>
        </form>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <div className="input-tarefa">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTaskCompletion(index)}
                  disabled={task.completed}
                />
                <span
                  style={{
                    textDecoration: task.done ? 'line-through' : 'none',
                    textDecorationColor: task.done ? '#ff0000' : 'initial',
                    color: task.done ? '#999' : '#FFF',
                  }}
                  className="task-title"
                >
                  {task.title}
                </span>
              </div>
              <Timer
                initialTime={task.timer}
                onComplete={() => markTaskAsCompleted(index)}
                onTimeUpdate={(updatedTime) => {
                  setTasks((prevTasks) =>
                    prevTasks.map((task, i) =>
                      i === index ? { ...task, timer: updatedTime } : task,
                    ),
                  );
                }}
                isCompleted={task.done}
              />
              <button
                className="btn-remove"
                onClick={() => handleRemoveTask(index)}
              >
                ❎ Remover
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
