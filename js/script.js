const mockAPI = 
{
  items: [
  ],
}

const view = document.querySelector('.view');
const modal = document.querySelector('.modal');
const modalTagList = document.querySelector('.modal-tag-list');
const modalImage = document.querySelector('#modal-image');
const search = document.querySelector('input#search');

function getItems()
{
  return JSON.parse(localStorage.getItem('items')) ?? [];
}

function setItems(items)
{
  if (!items) return;
  localStorage.setItem('items', JSON.stringify(items));
}

function buildCard(cardObj)
{
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  image.src = cardObj.imageUrl;
  image.alt = cardObj.name.toLowerCase();
  
  const content = document.createElement('div');
  content.classList.add('card-content');

  const name = document.createElement('h3');
  name.innerText = cardObj.name;

  const tagList = document.createElement('ul');
  tagList.classList.add('tag-list')
  cardObj.tags.forEach((tag) => {
    const tagElement = document.createElement('li');
    tagElement.classList.add('tag');
    tagElement.innerText = tag;
    tagList.appendChild(tagElement);
  });

  content.appendChild(name);
  content.appendChild(tagList);

  card.appendChild(image);
  card.appendChild(content);

  return card;
}

function clearView()
{
  [].slice.call(view.children).forEach((item) => view.removeChild(item))
}

function updateCards()
{
  clearView();
  
  getItems().forEach((item) => {

    if (search && search.value)
    {
      console.log(item.name.includes(search.value))
      if (item.name.toLowerCase().includes(search.value.toLowerCase()) || item.tags.find((i) => i.toLowerCase().includes(search.value.toLowerCase()) ))
      {
        view.appendChild(buildCard(item));
      }
    } else {
      view.appendChild(buildCard(item));
    }
  })
}

updateCards();

function closeModal(event)
{
  modal.classList.remove('active');
}

function tagChange(event)
{
  let values = event instanceof Event ? event.target.value : event;

  removeTags();
  list = [...new Set(values.split(" "))];
  list.forEach((tag) => {
    if (!tag) return;
    const tagElement = document.createElement('li');
    tagElement.classList.add('tag');
    tagElement.innerText = tag;
    modalTagList.appendChild(tagElement);
  });
}

function tagChangeLimit(event)
{
  let list = event.target.value.split(" ");
  if ([...new Set(list)].length > 3)
  {
    event.target.value = event.target.value.slice(0, event.target.value.length - list[list.length - 1].length).trim();
  }
}

function removeTags()
{
  [].slice.call(modalTagList.children).forEach((item) => modalTagList.removeChild(item))
}

function openModal(event)
{
  let nameInput = document.querySelector('input#name');
  let tagsInput = document.querySelector('input#tags');

  let file = event.target.files[0];
  let reader  = new FileReader();
  nameInput.value = file.name;
  tagsInput.value = "#incrivel "
  tagChange(tagsInput.value);

  reader.onloadend = () => {
    modalImage.src = reader.result;
  }

  if (file)
  {
    reader.readAsDataURL(file);
  }
  modal.classList.add('active');
}

function addImage()
{
  let nameInput = document.querySelector('input#name');
  let tagsInput = document.querySelector('input#tags');
  
  let newList = [...getItems(), {
    imageUrl: modalImage.src,
    name: nameInput.value,
    tags: tagsInput.value.trim().split(' '),
  }];

  setItems(newList);

  closeModal();
  updateCards();
}