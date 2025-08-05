  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = personnesFiltrees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(personnesFiltrees.length / itemsPerPage);
