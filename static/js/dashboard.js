var sections = ['introduction', 
				'profile', 
				'typology', 
				'characteristics', 
				'foundation', 
				'model', 
				'accessibility', 
				'design', 
				'instruction', 
				'playability', 
				'assessment', 
				'justification'];


var characteristics = {
	'Education Game': [
		'Memory tasks',
		'Perfection Impossible',
		'Controllers',
		'Customisable',
		'Know your target',
		'Start Simple'
	],
	'Design': [
		'Restrictions',
		'Acceptance',
		'Impede Creativity',
		'Group Size',
		'Restrictions are Good',
		'Fun',
		'Easier to Learn',
		'Real World',
		'Creative',
		'Visualise'
	],
	'Life of Game': [
		'Having an online',
		'Editors',
		'Modelling',
		'Intrinsically Rewarding',
		'Explore'
	],
	'Engagement': [
		'Entertaining',
		'Gameplay Exciting',
		'Don\'t Force Learning',
		'Real Life',
		'Teamwork',
		'Communication',
		'Debriefing',
		'Role Differentiation',
		'Common Goal',
		'Prevent Interruptions',
		'Group Size',
		'Incentive for Engagement',
		'Games a Good Tool'
	],
	'Assessment': [
		'Learn via Playing',
		'External Assessor',
		'Integrate Learning with Gameplay',
		'Anonymous Voting',
		'Focus on Learning Outcomes',
		'Use of Framework',
		'Use References',
		'More Instruction',
		'Assess Specific Skills',
		'Methods of assessment',
		'Peer Assessment',
		'Matching results with objectives',
		'Observation and discussion',
		'Change in Performance & Behaviours',
		'Challenges in achievement of learning outcomes'
	],
	'Mechanics': [
		'Time Pressure',
		'Teach Time Management',
		'Finish within time Limit',
		'Every Person Talk',
		'Moderators Time Management',
		'Facilitator',
		'Time Limits',
	],
	'Human Factor': [
		'Learn Different Opinions',
		'Prosocial Behaviours'
	],
	'Characteristics of a good game': [
		'Essence',
		'GOALS/OBJECTIVE',
		'Experimenting',
		'Achievement of outcomes',
		'Iterative process',
		'Ability of learners to understand the outcomes',
		'Integration of objectives with different game element',
		'Alternative means for achievement',
		'Fun Element',
		'Focus motivation for achievement',
		'Matching Requirements with goals',
		'Promotion of Autonomy',
		'Iterative Emergent Process',
		'Development of different skills',
		'Low risks',
		'Link theory with practice',
		'Promotes Co-Creation of game',
		'Opportunity for differentiation',
		'Ability of solve real world problems',
		'Developing attitude and mindset of learners',
		'Use of triadic perspective of learning',
		'Encourage innovative thinking',
		'Measureable learning outcomes',
		'Improves learning',
		'Creative activies',
		'Eliminates fear of failure',
		'Easily accessible'
	],
	'Social Skills': [
		'Adaptability',
		'Empathy',
		'Interactive',
		'Communication',
		'Teamwork'
	],
	'What is a failure?': [
		'Ability to complete task',
		'Fail as a team',
		'Not engaging',
		'Avoid Lack of communication'
	],
	'Rules': [
		'Easy Instruction',
		'Collective effort to solve problems',
		'Difficulty level',
		'Ability to bend the rules to win'
	],
	'Interaction': [
		'Platform for Collective acivity',
		'Enjoying the process',
		'Involves collaboration and teamwork'
	],
	'Applications of Games': [
		'Skills and competencies of target audience',
		'Creativity',
		'Problem Solving',
		'Risk Assessment',
		'Communication',
		'Critical thinking',
		'Lifelong learning',
		'Metacognitive awareness of leaners',
		'Assessing stake',
		'Decision making',
		'Negotiation',
		'Teamwork',
		'Adaptation & Recognising Patterns'
	],
	'Skills of Educators': [
		'Assessment of Processes and outcomes',
		'Learning from Process',
		'Mapping Learning outcome',
		'Learning how to engage learners and intervene'
	],
	'Inclusivity': [
		'Consult Students',
		'Incentives for students',
		'Game Around Interest',
		'Mechanics to Ensure Listening',
		'Ways they Learn',
		'Each state opinion',
		'Non-native Gamers',
		'Small Group (4-6)',
		'Innacurate Preconceptions',
		'Don\'t jump between ideas',
		'Know your target'
	],
	'Playtesting': [
		'Don\'t Expect Rule of Thumb',
		'Disability',
		'Information Transmission',
		'Agile Approach',
		'Focus Group',
		'Fun to Lose',
		'Adapt to Feedback',
		'No Pressure',
		'Want to Learn',
		'Replay-ability',
		'Customisability',
		'Simple',
		'Atomic Parameters',
		'Co-operation',
		'Custom Interface',
		'Common Ground'
	],
	'Sustainability of Games': [
		'Contextualising reusability',
		'Intermittent dicussion between sessions',
		'Co-creation of games',
		'Connecting overall gaming experiences',
		'Involving old students in new courses',
		'Replay-ability of the existing games that are naturally compounded of different stages',
		'Reusability of games'
	]
}

function processButton(button) {
	if ($(button).hasClass("green")) {
		$(button).removeClass("green");
		$(button).removeAttr("selected")
	} else {
		$(button).addClass("green");
		$(button).attr("selected", "")
	}
}

function processSection(sectionID) {
	if (sectionID === "introduction-content") {
		console.log("intro")
		unlockNextSection(sectionID);
	} else {
		var section = $("#" + sectionID).find("button");
		console.log(section);
	}
}


$(document).ready(function() {
	// TODO:
	// Check if jwt token exists
	// If it does, parse it and get the last section visited
	// Set the last section button styles
	// If the cookie doesn't exist start from the beginning

	if (getCookie("_game_data") !== null) {
		sections = JSON.parse(getCookie("_game_data"));
		sections_keys = Object.keys(sections);
		latestSection = sections_keys[sections_keys.length - 1];

		removeAllStyling();

		switch (latestSection) {
			case('introduction'):
				addSectionStyling('#introduction');
				break;
			case('profile'):
				addSectionStyling('#profile');
				break;
			case('typology'):
				addSectionStyling('#typology');
				break;
			case('characteristics'):
				addSectionStyling('#characteristics');
				break;
			case('foundation'):
				addSectionStyling('#foundation');
				break;
			case('model'):
				addSectionStyling('#model');
				break;
			case('accessibility'):
				addSectionStyling('#accessibility');
				break;
			case('design'):
				addSectionStyling('#design');
				break;
			case('instruction'):
				addSectionStyling('#instruction');
				break;
			case('playability'):
				addSectionStyling('#playability');
				break;
			case('assessment'):
				addSectionStyling('#assessment');
				break;
			case('justification'):
				addSectionStyling('#justification');
				break;
		}
	}
});


// Set all styling to default/disabled/hidden
function removeAllStyling() {
	$('.list-group-item.list-group-item-action').removeClass('active').removeAttr('aria-current');
	$('.list-group-item.list-group-item-action').attr('disabled', true).css('background-color', 'lightgray');
	$('.dashboard-content').hide();
}

// Helper function to add styling to sections on page load
// Uses saved cookie data to determine which sections to add styling to
function addStyling(latestSection) {
	no_previous_sections = sections.indexOf(latestSection);
	for (let i = 0; i < no_previous_sections; i++) {
		$('#' + sections[i]).removeAttr('disabled style');
	}
	$('#progress-bar').attr('aria-valuenow', (no_previous_sections) * 8.33333333333).css('width', (no_previous_sections) * 8.33333333333 + '%');
	$(latestSection).removeAttr('disabled style').addClass('active').attr('aria-current', 'true');
	$(latestSection + '-content').show();
}


// Helper function to increment progress bar
function incrementProgressBar() {
	let progress = parseInt($('#progress-bar').attr('aria-valuenow')) + 8.33333333333; // Increment progress bar value
	$('#progress-bar').attr('aria-valuenow', progress).css('width', progress + '%'); // Update progress bar
}


// Helper function to unlock next section when a section is completed
// Applies styling to the current/next section buttons and content sections
function unlockNextSection(currentSection) {
	let currentSectionButton = $('#' + currentSection);
	let currentSectionContent = $('#' + currentSection + '-content');

	let nextSectionButton = $('#' + currentSection).next();
	let nextSectionContent = $('#' + currentSection + '-content').next();

	if (currentSectionButton.children().val() === "0") {
		if (nextSectionButton.length !== 0) {
			currentSectionButton.removeClass('active').removeAttr('aria-current');
			nextSectionButton.removeAttr('disabled style');
			currentSectionButton.children().val(1);
			nextSectionButton.addClass('active').attr('aria-current', 'true');
			currentSectionContent.hide();
			nextSectionContent.show()
			incrementProgressBar();
		} else {
			$('#progress-bar').attr('aria-valuenow', 100).css('width', 100 + '%');
		}
	} else {
		// Change button styling
		currentSectionButton.removeClass('active').removeAttr('aria-current');
		nextSectionButton.addClass('active').attr('aria-current', 'true')
		// Change content section
		currentSectionContent.hide();
		nextSectionContent.show();
	}
}


// TODO: Add cookie functionality, remove redundant testing code (if (clickedButton.children().val() === "0"), etc.) 
// Handle dashboard list button clicks
$('.list-group-item').click(function() {
	let currentButton = $('.list-group-item.list-group-item-action.active');
	let clickedButton = $(this);
	let clickedButtonContent = clickedButton.attr('id') + '-content';

	$.ajax({
	  url: '/ajax_handler',
	  data: { "data": "TEST" },
	  type: 'POST',
	  success: function(response) {
		$('.dashboard-content').hide(); // Hide all content sections
		$('#' + clickedButtonContent).show(); // Show clicked content section
		currentButton.removeClass('active').removeAttr('aria-current'); // Remove active styling from previous button
		clickedButton.addClass('active').attr('aria-current', 'true') // Add styling to clicked button
	  },
	  error: function(error) {
		console.error(error);
	  }
	});
});


// // Handle dashboard content submit button clicks
// $('.dashboard-content-submit').click(function() {
// 	let submit_button = $(this);
// 	let currentSection = submit_button.attr('id').split('-')[0];
// 	$.ajax({
// 		url: '/ajax_handler',
// 		data: { "data": "TEST" },
// 		type: 'POST',
// 		success: function(response) {
// 			unlockNextSection(currentSection);
// 		},
// 		error: function(error) {
// 			console.error(error);
// 		}
// 	});
// });


// // Populate dropdown options for 'Game Characteristics' section on click
// $('.characteristics-content-dropdown').click(function() {
// 	charateristics_keys = Object.keys(characteristics);
// 	no_characteristics = charateristics_keys.length;
// 	for (let i = 0; i < no_characteristics; i++) {
// 		this.html('<option value="${characteristics}">${characteristics}</option>')
// 	}
// 	populateDropdown();
// });


// // Helper function to load dropdown options
// function populateDropdown(measure) {
// 	$('#' + measure).html('<option value="${measure}">${measure}</option>');
// }



