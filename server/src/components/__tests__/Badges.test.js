const { render, screen } = require('@testing-library/react');
const Badges = require('../../../../frontend/src/components/Badges');

test('renders Badges component', () => {
	render(<Badges />);
	const linkElement = screen.getByText(/badge/i);
	expect(linkElement).toBeInTheDocument();
});