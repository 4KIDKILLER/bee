import {
  Input,
  Field,
  Button,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "/@c/index";

function Overview() {
  return (
    <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="checkout-7j9-optional-comments">
                Comments
              </FieldLabel>
              <Input
                required
                id="checkout-7j9-optional-comments"
                placeholder="Add any additional comments"
                className="resize-none"
              />
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default Overview;
