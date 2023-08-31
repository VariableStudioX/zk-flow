import HomePage from './pages/HomePage.tsx';
import AddressPage from './pages/AddressPage.tsx';
import AddressListPage from './pages/AddressListPage.tsx';
import ContractPage from './pages/ContractPage.tsx';

const App = () => {
  const { search } = window.location;
  return (
    <main className="absolute top-0 left-0 w-full min-h-full bg-gray-100 dark:bg-gray-900">
      {search.includes('?addresslist') ? (
        <AddressListPage />
      ) : search.includes('type=Contract') ? (
        <ContractPage />
      ) : !search.includes('?address=') ? (
        <HomePage />
      ) : (
        <AddressPage />
      )}
    </main>
  );
};

export default App;
