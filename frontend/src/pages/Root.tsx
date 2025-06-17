import Button from '../components/Button';

import parentsImage from '../assets/parents.png';
import teacherImage from '../assets/teacher.png';

export default function Root() {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-xl font-semibold mb-4 text-center">Welkom bij EDU Planner</h1>
			<p className="text-center mb-6 text-gray-500 max-w-xl">
				EDU Planner is een platform voor het plannen van oudergesprekken en het beheren van afspraken tussen ouders en docenten. Kies hieronder uw rol om verder te gaan.
			</p>

			<div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center items-center">
				<div className="flex flex-col items-center justify-center w-full sm:w-1/2">
					<img src={parentsImage} alt="Parents" className="w-32 h-32 mb-4" />
					<Button text="Ik ben een Ouder/verzorger" action={() => window.location.href = '/Parents/Login'} classes="w-full max-w-xs" />
				</div>
				<div className="flex flex-col items-center justify-center w-full sm:w-1/2">
					<img src={teacherImage} alt="Teacher" className="w-32 h-32 mb-4" />
					<Button text="Ik ben een werknemer" action={() => window.location.href = '/Login'} classes="w-full max-w-xs" />
				</div>
			</div>
		</div>
	);
}
