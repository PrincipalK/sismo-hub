import { dataOperators } from "@group-generators/helpers/data-operators";
import { dataProviders } from "@group-generators/helpers/data-providers";
import { Tags, ValueType, GroupWithData } from "topics/group";
import { GenerationContext, GenerationFrequency, GroupGenerator } from "topics/group-generator";

const generator: GroupGenerator = {
  generationFrequency: GenerationFrequency.Once,
  generate: async (context: GenerationContext): Promise<GroupWithData[]> => {
    // 1. Instantiate snapshot provider
    const snapshotProvider = new dataProviders.SnapshotProvider();
    // Query all voters from the first proposal on space named "ens.eth"
    // https://snapshot.org/#/ens.eth/proposal/QmW5qrWwivELsMdLViGMTmH27QQYjyqGM2PMqVwpYxL2UN
    const voters = await snapshotProvider.queryProposalVoters({
      proposal: "QmW5qrWwivELsMdLViGMTmH27QQYjyqGM2PMqVwpYxL2UN",
    });

    // 2. Instantiate Github Provider
    const githubProvider = new dataProviders.GithubProvider();
    // Query all contributors of ens and ens-contracts repositories
    const contributors = await githubProvider.getRepositoriesContributors({
      repositories: ["ensdomains/ens", "ensdomains/ens-contracts"],
    });

    // 3. Make a union of the two queried data
    const tutorialEnsContributors = dataOperators.Union([voters, contributors]);

    return [
      {
        name: "tuto-ens-contributors",
        timestamp: context.timestamp,
        description: "Be an early contributor of ENS",
        specs: "You should have previously voted on the first proposal of ENS Snapshot space or have contributed on ensdomains/ens or ensdomains/ens-contracts repositories.",
        data: tutorialEnsContributors,
        valueType: ValueType.Score,
        tags: [Tags.User],
      },
    ];
  },
};

export default generator;