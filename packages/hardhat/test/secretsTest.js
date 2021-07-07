const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("DeSec", () => {
  let secretsContract;

  describe("Secrets", () => {
    const getSecretList = async (cursor = 10, limit = 5) => {
      return secretsContract.getPaginatedSecrets(cursor, limit);
    };

    it("Should deploy Secrets contract", async () => {
      const Secrets = await ethers.getContractFactory("Secrets");
      secretsContract = await Secrets.deploy();
    });

    describe("add()", () => {
      it("Should be able to add a new secret", async () => {
        const newSecret = "Test New Secret 0";
        await secretsContract.add(newSecret);
        expect(await secretsContract.getCount()).to.equal(1);
      });

      it("Should be able to add multiple new secrets", async () => {
        await secretsContract.add("Test new secret 1");
        await secretsContract.add("Test new secret 2");
        await secretsContract.add("Test new secret 3");
        await secretsContract.add("Test new secret 4");
        await secretsContract.add("Test new secret 5");
        await secretsContract.add("Test new secret 6");
        await secretsContract.add("Test new secret 7");
        await secretsContract.add("Test new secret 8");
        await secretsContract.add("Test new secret 9");
        expect(await secretsContract.getCount()).to.equal(10);
      });

      it("Should throw an error if message is empty", async () => {
        try {
          await secretsContract.add("");
          expect.fail("The transaction should have already thrown an error");
        } catch (err) {
          expect(err.message).to.include("Message must not be empty");
        }
      });
    });

    describe("getPaginatedSecrets()", () => {
      it("Should return a list of secrets (from most recent to least recent) corresponding to the cursor and limit passed as params", async () => {
        const [secretList, newCursor, isEnd] = await getSecretList();
        expect(secretList).to.have.lengthOf(5);
        expect(newCursor).to.equal(4);
        expect(isEnd).to.equal(false);
      });

      it("Should return the end of the list if the cursor passed is bigger than the array length", async () => {
        const [secretList, newCursor, isEnd] = await getSecretList();
        expect(secretList).to.have.lengthOf(5);
        expect(newCursor).to.equal(4);
        expect(isEnd).to.equal(false);
      });

      it("Should return the beginning of the list if the (cursor - limit) < 0", async () => {
        const [secretList, newCursor, isEnd] = await getSecretList(1);
        expect(secretList).to.have.lengthOf(2);
        expect(newCursor).to.equal(0);
        expect(isEnd).to.equal(true);
      });
    });

    describe("like()", () => {
      const like = async (signer, cursor = 0, limit = 1) => {
        const [secretList] = await getSecretList(cursor, limit);
        await secretsContract.connect(signer).like(secretList[0].entity_id);
        return secretsContract.getUserLike(
          signer.address,
          secretList[0].entity_id
        );
      };

      const getLikes = async (cursor = 0, limit = 1) => {
        const [secretList] = await getSecretList(cursor, limit);
        return secretList[0].likes;
      };

      it("Should add a like to a secret", async () => {
        const [signer] = await ethers.getSigners();
        expect(await like(signer)).to.equal(true);
        expect(await getLikes()).to.equal(1);
      });

      it("Should remove like if same user calls like() again for the same secret", async () => {
        const [signer] = await ethers.getSigners();
        expect(await like(signer)).to.equal(false);
        expect(await getLikes()).to.equal(0);
      });

      it("Should add likes from different users", async () => {
        const [
          signer1,
          signer2,
          signer3,
          signer4,
          signer5,
        ] = await ethers.getSigners();
        expect(await like(signer1)).to.equal(true, "Issue with signer1");
        expect(await like(signer2)).to.equal(true, "Issue with signer2");
        expect(await like(signer3)).to.equal(true, "Issue with signer3");
        expect(await like(signer4)).to.equal(true, "Issue with signer4");
        expect(await like(signer5)).to.equal(true, "Issue with signer5");
        expect(await getLikes()).to.equal(5);
      });
    });

    describe("report()", () => {
      const report = async (signer, cursor = 0, limit = 1) => {
        const [secretList] = await getSecretList(cursor, limit);
        await secretsContract.connect(signer).report(secretList[0].entity_id);
        return secretsContract.getUserReport(
          signer.address,
          secretList[0].entity_id
        );
      };

      const getReports = async (cursor = 0, limit = 1) => {
        const [secretList] = await getSecretList(cursor, limit);
        return secretList[0].reports;
      };

      it("Should add a report to a secret", async () => {
        const [signer] = await ethers.getSigners();
        expect(await report(signer)).to.equal(true);
        expect(await getReports()).to.equal(1);
      });

      it("Should remove report if same user calls report() again for the same secret", async () => {
        const [signer] = await ethers.getSigners();
        expect(await report(signer)).to.equal(false);
        expect(await getReports()).to.equal(0);
      });

      it("Should add reports from different users", async () => {
        const [
          signer1,
          signer2,
          signer3,
          signer4,
          signer5,
        ] = await ethers.getSigners();
        expect(await report(signer1)).to.equal(true, "Issue with signer1");
        expect(await report(signer2)).to.equal(true, "Issue with signer2");
        expect(await report(signer3)).to.equal(true, "Issue with signer3");
        expect(await report(signer4)).to.equal(true, "Issue with signer4");
        expect(await report(signer5)).to.equal(true, "Issue with signer5");
        expect(await getReports()).to.equal(5);
      });
    });
  });
});
