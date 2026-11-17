import { Navbar, NavbarBrand } from "react-bootstrap"
import { HamburgerButton } from "../../buttons/Hamburger/HamburgerButton"
import { ThemeDropdownBtn } from "../../buttons/ThemeDropdownBtn/ThemeDropdownBtn"

export const AppNavbar = (
	{isAsideOpened, setIsAsideOpened} : {
		isAsideOpened: boolean,
		setIsAsideOpened: (isOpen: boolean) => void
	}
) => {
	return (
		<Navbar
			className="bg-body border-1 border-bottom d-lg-none"
			style={{ position: "sticky", top: "0px", zIndex: "6" }}
		>
			<div className="m-auto main-wrapper flex-grow-1 d-flex align-items-center justify-content-between">
				<div className="d-flex align-items-center">
					<HamburgerButton
						isOpened={isAsideOpened}
						setIsOpened={setIsAsideOpened}
					/>
					<NavbarBrand
						className="position-relative py-1"
						style={{ left: "calc(-0.75rem + 1px)" }}
						href="/"
					>
						<span className="mb-0 fs-3 fw-semibold">HoF</span>
					</NavbarBrand>
				</div>
				<ThemeDropdownBtn align="end" />
			</div>
		</Navbar>

	)
}
