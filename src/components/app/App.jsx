import './App.css';
import TabsContainer from '../TabsContainer/TabsContainer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

	return (
		<BrowserRouter>
			<TabsContainer />
			<Routes>
				<Route path="/home" element={<div>Home content</div>} />
				<Route path="/dashboard" element={<div>Dashboard content</div>} />
				<Route path="/banking" element={<div>Banking content</div>} />
				<Route path="/telefonie" element={<div>Telefonie content</div>} />
				<Route path="/verkauf" element={<div>Verkauf content</div>} />
				<Route path="/settings" element={<div>Settings content</div>} />
				<Route path="/analytics" element={<div>Analytics content</div>} />
				<Route path="/reports" element={<div>Reports content</div>} />
				<Route path="/users" element={<div>Users content</div>} />
				<Route path="/notifications" element={<div>Notifications content</div>} />
				<Route path="/messages" element={<div>Messages content</div>} />
				<Route path="/support" element={<div>Support content</div>} />
				<Route path="/photo" element={<div>Photo content</div>} />
				<Route path="/chris" element={<div>Chris content</div>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
