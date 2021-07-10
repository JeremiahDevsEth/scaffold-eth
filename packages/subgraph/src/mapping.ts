import { NewLike, NewReport, NewSecret } from "../generated/Secrets/Secrets"
import { Like, Report, Secret } from "../generated/schema"
import { store, } from "@graphprotocol/graph-ts";

export function handleNewSecret(event: NewSecret): void {
  let secretId = event.params.newSecret.entity_id.toHexString();
  let secret = Secret.load(secretId);

  if (secret == null) {
    secret = new Secret(secretId);
    secret.text = event.params.newSecret.text;
    secret.likes = event.params.newSecret.likes;
    secret.reports = event.params.newSecret.reports;
    secret.created_at = event.params.newSecret.created_at;
  }

  secret.save();
}

export function handleNewLike(event: NewLike): void {
  let likeId = event.params.sender.toHexString().concat("_").concat(event.params.secret.entity_id.toHexString());
  let like = Like.load(likeId);
  let secret = Secret.load(event.params.secret.entity_id.toHexString());

  if (like == null) {
    like = new Like(likeId);
    like.address = event.params.sender;
    like.secret = event.params.secret.entity_id.toHexString();
    like.status = event.params.status;
  } else {
    store.remove("Like", like.id);
  }
  secret.likes = event.params.secret.likes;

  like.save();
  secret.save();
}

export function handleNewReport(event: NewReport): void {
  let reportId = event.params.sender.toHexString().concat("_").concat(event.params.secret.entity_id.toHexString());
  let report = Report.load(reportId);
  let secret = Secret.load(event.params.secret.entity_id.toHexString());

  if (report == null) {
    report = new Report(reportId);
    report.address = event.params.sender;
    report.secret = event.params.secret.entity_id.toHexString();
    report.status = event.params.status;
  } else {
    store.remove("Report", report.id);
  }
  secret.reports = event.params.secret.reports;

  report.save();
  secret.save();
}
