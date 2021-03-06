import database from '../../database';

const COLLECTION_MOVIES = 'Movies';

function Movie(attrs) {
  for (var name in attrs) {
    this[name] = attrs[name];
  }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const allMovies = async () => {
  return database.getAll(COLLECTION_MOVIES);
};

const getMovieByName = async name => {
  return await database.getBy(COLLECTION_MOVIES, 'name', name);
};

const getMovieById = async id => {
  return await database.getBy(COLLECTION_MOVIES, 'id', id);
};

const insertMovie = async (item, seasons) => {
  let newStrItem = replaceAll(JSON.stringify(item), '_links', 'links');
  newStrItem = replaceAll(newStrItem, '_embedded', 'embedded');
  const newItem = JSON.parse(newStrItem);
  await database.insert(
    new Movie({
      ...newItem,
      _id: newItem.id.toString(),
      seasons: seasons,
      offline: true,
    }),
    COLLECTION_MOVIES,
  );

  const savedObject = await getMovieById(item.id);

  return savedObject[0];
};

const removeMovie = async item => {
  const remItem = await getMovieById(item.id);
  return await database.remove(remItem[0], COLLECTION_MOVIES);
};

function compare(a, b) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

const getAllSortName = async () => {
  const rawData = await database.getAll(COLLECTION_MOVIES);

  const result = rawData.sort(compare);
  return result;
};

const repository = {
  allMovies,
  insertMovie,
  getAllSortName,
  getMovieById,
  getMovieByName,
  removeMovie,
};

export default repository;
