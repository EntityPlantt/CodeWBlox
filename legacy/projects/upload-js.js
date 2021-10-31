function submitUpload() {
	var github = new Github({
		username: document.getElementById("github-username").value,
		password: document.getElementById("github-password").value,
		auth: "basic"
	});
	var repository = github.getRepo("EntityPlantt", "CodeWBlox");
	var filename = document.getElementById("project-file").files[0].name;
	var filecontent, fileReader = new FileReader();
	fileReader.onload = function() {
		filecontent = fileReader.result;
		if (!hasValue(filename) || !hasValue(filecontent) || !hasValue(repository) || !hasValue(github))
			return;
		if (filename.indexOf(".") > -1)
			filename = filename.substring(0, filename.indexOf("."));
		uploadFileToGithub(
			repository,
			"main",
			"uploaded_projects/" + (NumberOfProjectsOnSite() + 1) + ".cwb",
			filecontent,
			document.getElementById("github-username").value + " added a CodeWBlox project"
		);
	};
	fileReader.readAsText(document.getElementById("project-file").files[0]);
}