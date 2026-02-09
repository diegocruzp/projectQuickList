// ==============================================
// QUICKLIST - Lógica JavaScript
// ==============================================

// Elementos do DOM
const form = document.querySelector('form');
const inputItem = document.querySelector('.input-wrapper input');
const btnAddItem = document.querySelector('.btn-addItem');
const shoppingList = document.getElementById('shoppingList');
const alertNotification = document.getElementById('alertNotification');
const alertCloseBtn = document.querySelector('.alert-close');

// ID para itens únicos
let itemId = 4; // Começamos em 4 porque já temos 4 itens no HTML

// ==============================================
// FUNÇÃO: Adicionar novo item
// ==============================================
function addItem(event) {
    event.preventDefault(); // Previne reload da página
    
    const itemText = inputItem.value.trim();
    
    // Validação: previne inputs vazios
    if (itemText === '') {
        alert('Por favor, adicione um item válido!');
        inputItem.focus();
        return;
    }
    
    // Incrementa o ID
    itemId++;
    
    // Cria o novo elemento <li>
    const newItem = document.createElement('li');
    newItem.classList.add('list-item');
    newItem.id = `item-${itemId}`;
    
    newItem.innerHTML = `
        <input type="checkbox" class="item-checkbox" id="checkbox-${itemId}">
        <span class="item-text">${escapeHTML(itemText)}</span>
        <button class="btn-delete" aria-label="Deletar item">🗑️</button>
    `;
    
    // Adiciona à lista
    shoppingList.appendChild(newItem);
    
    // Limpa o input
    inputItem.value = '';
    inputItem.focus();
    
    // Salva no LocalStorage
    saveToLocalStorage();
    
    // Adiciona event listener ao novo botão delete
    addDeleteListener(newItem.querySelector('.btn-delete'));
}

// ==============================================
// FUNÇÃO: Remover item
// ==============================================
function deleteItem(event) {
    event.preventDefault();
    
    // Encontra o <li> pai do botão
    const listItem = event.target.closest('.list-item');
    
    // Animação de saída (opcional)
    listItem.style.opacity = '0';
    listItem.style.transform = 'translateX(100%)';
    listItem.style.transition = 'all 0.3s ease';
    
    // Remove após a animação
    setTimeout(() => {
        listItem.remove();
        saveToLocalStorage();
        showAlert(); // Mostra mensagem de sucesso
    }, 300);
}

// ==============================================
// FUNÇÃO: Mostrar alerta de remoção
// ==============================================
function showAlert() {
    // Remove classe 'show' antes de adicionar para permitir re-trigger da animação
    alertNotification.classList.remove('show');
    
    // Força reflow para resetar a animação
    void alertNotification.offsetWidth;
    
    // Adiciona a classe para mostrar
    alertNotification.classList.add('show');
    
    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        hideAlert();
    }, 4000);
}

// ==============================================
// FUNÇÃO: Esconder alerta
// ==============================================
function hideAlert() {
    alertNotification.classList.remove('show');
}

// ==============================================
// FUNÇÃO: Salvar em LocalStorage
// ==============================================
function saveToLocalStorage() {
    const items = [];
    document.querySelectorAll('.list-item').forEach(item => {
        const checkbox = item.querySelector('.item-checkbox');
        const text = item.querySelector('.item-text');
        
        items.push({
            text: text.textContent,
            completed: checkbox.checked
        });
    });
    
    localStorage.setItem('quicklistItems', JSON.stringify(items));
}

// ==============================================
// FUNÇÃO: Carregar do LocalStorage
// ==============================================
function loadFromLocalStorage() {
    const savedItems = localStorage.getItem('quicklistItems');
    
    if (savedItems) {
        const items = JSON.parse(savedItems);
        
        // Limpa a lista atual (mantém apenas itens salvos)
        shoppingList.innerHTML = '';
        
        // Recria cada item
        items.forEach((item, index) => {
            itemId = index + 1;
            
            const newItem = document.createElement('li');
            newItem.classList.add('list-item');
            newItem.id = `item-${itemId + 1}`;
            
            newItem.innerHTML = `
                <input type="checkbox" class="item-checkbox" id="checkbox-${itemId + 1}" ${item.completed ? 'checked' : ''}>
                <span class="item-text">${escapeHTML(item.text)}</span>
                <button class="btn-delete" aria-label="Deletar item">🗑️</button>
            `;
            
            shoppingList.appendChild(newItem);
            addDeleteListener(newItem.querySelector('.btn-delete'));
            addCheckboxListener(newItem.querySelector('.item-checkbox'));
        });
    }
}

// ==============================================
// FUNÇÃO: Escapar HTML (Segurança XSS)
// ==============================================
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==============================================
// FUNÇÃO: Adicionar listener ao delete
// ==============================================
function addDeleteListener(button) {
    button.addEventListener('click', deleteItem);
}

// ==============================================
// FUNÇÃO: Adicionar listener ao checkbox
// ==============================================
function addCheckboxListener(checkbox) {
    checkbox.addEventListener('change', () => {
        saveToLocalStorage();
    });
}

// ==============================================
// INICIALIZAÇÃO
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados salvos
    loadFromLocalStorage();
    
    // Event listeners
    form.addEventListener('submit', addItem);
    alertCloseBtn.addEventListener('click', hideAlert);
    
    // Adiciona listeners aos botões delete existentes
    document.querySelectorAll('.btn-delete').forEach(button => {
        addDeleteListener(button);
    });
    
    // Adiciona listeners aos checkboxes existentes
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        addCheckboxListener(checkbox);
    });
});
