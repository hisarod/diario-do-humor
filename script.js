// Função para pegar dia da semana abreviado
function getDayName(index) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[index];
}

// Função para salvar dados no localStorage
function saveToStorage(data) {
  localStorage.setItem('diarioHumor', JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadFromStorage() {
  const data = localStorage.getItem('diarioHumor');
  return data ? JSON.parse(data) : [];
}

// Função para atualizar histórico e resumo na tela
function updateDisplay(data) {
  const historyDiv = document.getElementById('history');
  const summaryDiv = document.getElementById('summary');
  historyDiv.innerHTML = '';
  summaryDiv.innerHTML = '';

  // Mostrar histórico dos últimos 7 dias
  const last7Days = data.slice(-7);

  // Contar frequência por emoji
  const freq = {};

  last7Days.forEach(item => {
    // Formatar dia da semana
    const date = new Date(item.date);
    const dayName = getDayName(date.getDay());

    // Mostrar histórico
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerText = `${dayName}: ${item.emoji} "${item.reason}"`;
    historyDiv.appendChild(div);

    // Contar frequência
    freq[item.emoji] = (freq[item.emoji] || 0) + 1;
  });

  // Mostrar resumo
  for (const emoji in freq) {
    const span = document.createElement('span');
    span.innerText = `${emoji} x${freq[emoji]} `;
    summaryDiv.appendChild(span);
  }
}

// Variáveis do app
let selectedEmoji = null;
let diaryData = loadFromStorage();

// Seleção de nome do usuário
const nameInput = document.getElementById('nameInput');
const btnName = document.getElementById('btnName');
const welcomeDiv = document.getElementById('welcome');
const userNameInputDiv = document.getElementById('userNameInput');
const diaryDiv = document.getElementById('diary');

btnName.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Por favor, digite seu nome.');
    return;
  }
  localStorage.setItem('userName', name);
  welcomeDiv.innerText = `Bem-vindo(a), ${name}!`;
  userNameInputDiv.style.display = 'none';
  diaryDiv.style.display = 'block';
  updateDisplay(diaryData);
};

// Mostrar nome se já tiver salvo
window.onload = () => {
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    welcomeDiv.innerText = `Bem-vindo(a), ${savedName}!`;
    userNameInputDiv.style.display = 'none';
    diaryDiv.style.display = 'block';
    updateDisplay(diaryData);
  }
};

// Emojis - seleção
const emojiButtons = document.querySelectorAll('.emoji-picker button');
const saveBtn = document.getElementById('saveBtn');
const reasonInput = document.getElementById('reasonInput');

emojiButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove seleção anterior
    emojiButtons.forEach(b => b.classList.remove('selected'));
    // Seleciona o clicado
    btn.classList.add('selected');
    selectedEmoji = btn.dataset.emoji;
    checkEnableSave();
  });
});

// Habilita botão salvar se emoji e motivo preenchidos
function checkEnableSave() {
  saveBtn.disabled = !(selectedEmoji && reasonInput.value.trim());
}

reasonInput.addEventListener('input', checkEnableSave);

// Salvar humor do dia
saveBtn.onclick = () => {
  if (!selectedEmoji || !reasonInput.value.trim()) return;

  // Verifica se já tem registro para o dia atual e substitui
  const todayStr = new Date().toDateString();

  // Remove se já tem registro do dia
  diaryData = diaryData.filter(entry => new Date(entry.date).toDateString() !== todayStr);

  // Adiciona o novo registro
  diaryData.push({
    date: new Date(),
    emoji: selectedEmoji,
    reason: reasonInput.value.trim()
  });

  saveToStorage(diaryData);
  updateDisplay(diaryData);

  // Limpa seleção e campo
  emojiButtons.forEach(b => b.classList.remove('selected'));
  selectedEmoji = null;
  reasonInput.value = '';
  saveBtn.disabled = true;
};
