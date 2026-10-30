using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;

namespace SmartWalk.Core.Test.Algorithms;

[TestClass]
public class GeometryTests
{
    [TestMethod]
    public void AngleIsAlwaysValid()
    {
        for (int lon = -1; lon < 2; ++lon)
        {
            for (int lat = -1; lat < 2; ++lat)
            {
                var rads = Spherical.RotAngle(new (0.0, 0.0), new ((double)lon, (double)lat));
                var degs = Spherical.RadToDeg(rads);
                Assert.IsLessThanOrEqualTo(+180.0, degs);
                Assert.IsGreaterThanOrEqualTo(-180.0, degs);
            }
        }
    }
}
